import { NextRequest } from 'next/server';
import { updateCall } from '@/lib/supabase-support';
import { clearSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { callSid } = await req.json();
  await updateCall(callSid, { status: 'transferred', transferred: true });
  clearSession(callSid);
  return Response.json({ success: true });
}
