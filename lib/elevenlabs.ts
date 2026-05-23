import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY?.trim(),
});

export async function synthesizeVoice(
  text: string,
  voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || 'Rachel',
): Promise<Buffer> {
  const stream = await client.generate({
    voice: voiceId,
    text,
    model_id: process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_turbo_v2_5',
    stream: true,
  });
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
