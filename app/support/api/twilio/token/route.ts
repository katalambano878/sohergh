import { NextRequest } from 'next/server';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function POST(req: NextRequest) {
  try {
    const { chatHistory } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const apiKey = process.env.TWILIO_API_KEY?.trim();
    const apiSecret = process.env.TWILIO_API_SECRET?.trim();
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

    if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
      const missing = [
        !accountSid && 'TWILIO_ACCOUNT_SID',
        !apiKey && 'TWILIO_API_KEY',
        !apiSecret && 'TWILIO_API_SECRET',
        !twimlAppSid && 'TWILIO_TWIML_APP_SID',
      ].filter(Boolean).join(', ');
      return Response.json(
        { error: `Missing env vars: ${missing}` },
        { status: 500 },
      );
    }

    const identity = `customer-${Date.now()}`;
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity,
      ttl: 3600,
    });

    accessToken.addGrant(
      new VoiceGrant({ outgoingApplicationSid: twimlAppSid, incomingAllow: false }),
    );

    return Response.json({ token: accessToken.toJwt(), identity, chatHistory: chatHistory ?? '' });
  } catch (err: any) {
    console.error('[token/route] Error:', err?.message ?? err);
    return Response.json({ error: err?.message ?? 'Token generation failed' }, { status: 500 });
  }
}
