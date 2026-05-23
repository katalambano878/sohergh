import { NextRequest } from 'next/server';
import { getCall, updateCall, createSupportTicket } from '@/lib/supabase-support';
import { generateTicketSummary } from '@/lib/groq';
import { clearSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const callSid = body.get('CallSid') as string;

  const call = await getCall(callSid);
  if (!call) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response/>',
      { headers: { 'Content-Type': 'text/xml' } },
    );
  }

  const { summary, issueType } = await generateTicketSummary(
    call.transcript ?? '',
  );

  await createSupportTicket(call.id, summary, issueType);
  await updateCall(callSid, {
    status: 'completed',
    ended_at: new Date().toISOString(),
  });

  clearSession(callSid);
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><Response/>',
    { headers: { 'Content-Type': 'text/xml' } },
  );
}
