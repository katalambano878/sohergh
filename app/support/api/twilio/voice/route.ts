import { NextRequest } from 'next/server';
import { generateResponse } from '@/lib/groq';
import { getSession, addMessage } from '@/lib/session';
import { analyzeSentiment } from '@/lib/sentiment';
import { extractOrderNumber, lookupOrder } from '@/lib/orders';
import { createCall, updateCall, getCall } from '@/lib/supabase-support';
import { getPublicBaseUrl } from '@/lib/public-base-url';
import { getInstantKbReply, GENERIC_INSTANT_REPLY } from '@/lib/voice-kb';
import { synthesizeVoice } from '@/lib/elevenlabs';
import { supabaseAdmin } from '@/lib/supabase-admin';

function voiceUrl(): string {
  const base = getPublicBaseUrl();
  if (!base) throw new Error('NEXT_PUBLIC_APP_URL is not set');
  return `${base}/support/api/twilio/voice`;
}

function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function twiml(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>${body}</Response>`, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

let bucketReady: Promise<void> | null = null;

async function ensureVoiceBucket(bucket: string): Promise<void> {
  if (bucketReady) return bucketReady;
  bucketReady = (async () => {
    const { data } = await supabaseAdmin.storage.getBucket(bucket);
    if (!data) {
      await supabaseAdmin.storage.createBucket(bucket, { public: true });
    }
  })();
  await bucketReady;
}

async function speechVerb(text: string): Promise<string> {
  const mode = (process.env.SUPPORT_VOICE_MODE || 'twilio').trim().toLowerCase();
  const useCustom = mode === 'custom' && !!process.env.ELEVENLABS_VOICE_ID?.trim();
  if (!useCustom) {
    return `<Say voice="Polly.Joanna" language="en-US">${xml(text)}</Say>`;
  }

  try {
    const bucket = (process.env.VOICE_AUDIO_BUCKET || 'voice-call-audio').trim();
    await ensureVoiceBucket(bucket);
    const audio = await synthesizeVoice(text, process.env.ELEVENLABS_VOICE_ID?.trim());
    const path = `calls/${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`;
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, audio, { contentType: 'audio/mpeg', upsert: false });
    if (error) throw error;
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return `<Play>${xml(data.publicUrl)}</Play>`;
  } catch (err) {
    console.error('[voice/route] custom voice failed, using fallback:', err);
    return `<Say voice="Polly.Joanna" language="en-US">${xml(text)}</Say>`;
  }
}

async function gatherResponse(text: string, chatContext: string): Promise<Response> {
  const verb = await speechVerb(text);
  return twiml(`
    <Gather input="speech" action="${voiceUrl()}" method="POST"
      speechTimeout="auto" actionOnEmptyResult="true">
      ${verb}
      <Parameter name="chatContext" value="${encodeURIComponent(chatContext)}" />
    </Gather>
  `);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const callSid = body.get('CallSid') as string;
    const speechResult = body.get('SpeechResult') as string | null;
    const chatContext =
      (body.get('chatContext') as string | null) ??
      new URL(req.url).searchParams.get('chatContext') ??
      '';

    // ── Initial call (no speech yet) — greet the customer ──────────
    if (!speechResult) {
      // Fire-and-forget DB insert so greeting isn't blocked by it
      createCall(callSid, chatContext).catch(() => {});
      const greeting = chatContext
        ? 'Hi, this is Rachel from Sohergh support. I have your details from chat and I can help you right away.'
        : 'Hi, this is Rachel from Sohergh support. How can I help you today?';
      addMessage(callSid, 'assistant', greeting);
      return gatherResponse(greeting, chatContext);
    }

    // ── Ongoing conversation ───────────────────────────────────────
    // Run DB fetch + order lookup in parallel with building context
    const [call, orderContext] = await Promise.all([
      getCall(callSid).catch(() => null),
      (async () => {
        const num = extractOrderNumber(speechResult);
        return num ? lookupOrder(num) : '';
      })(),
    ]);

    const transcript = (call?.transcript ?? '') + `\nCustomer: ${speechResult}`;

    // ── Generate Rachel's reply (instant KB-first mode) ─────────────
    addMessage(callSid, 'user', speechResult);
    const session = getSession(callSid);
    const noThinking = (process.env.SUPPORT_VOICE_NO_THINKING || 'true')
      .trim()
      .toLowerCase() !== 'false';

    const kbReply = getInstantKbReply(speechResult, orderContext);

    let response = kbReply || '';
    if (!response && !noThinking) {
      const messagesWithContext = orderContext
        ? [
            ...session.slice(0, -1),
            { role: 'user' as const, content: `${speechResult}\n\n[Order info: ${orderContext}]` },
          ]
        : session;
      response = await generateResponse(messagesWithContext);
    }
    if (!response) response = GENERIC_INSTANT_REPLY;
    addMessage(callSid, 'assistant', response);

    // Fire-and-forget DB writes — don't block the TwiML response
    const sentiment = analyzeSentiment(transcript);
    updateCall(callSid, {
      transcript: transcript + `\nRachel: ${response}`,
      sentiment,
    }).catch(() => {});

    return gatherResponse(response, chatContext);
  } catch (err: any) {
    console.error('[voice/route] Error:', err?.message ?? err);
    return twiml(
      `<Say voice="Polly.Joanna">I'm sorry, something went wrong. Please try calling again.</Say>`,
    );
  }
}
