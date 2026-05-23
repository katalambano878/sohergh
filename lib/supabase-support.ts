import { supabaseAdmin } from './supabase-admin';

// ─── Calls ───────────────────────────────────────────────────────
export async function createCall(callSid: string, chatContext?: string) {
  const { data } = await supabaseAdmin
    .from('calls')
    .insert({ call_sid: callSid, chat_context: chatContext ?? '' })
    .select()
    .single();
  return data;
}

export async function updateCall(callSid: string, updates: Record<string, any>) {
  await supabaseAdmin.from('calls').update(updates).eq('call_sid', callSid);
}

export async function getCall(callSid: string) {
  const { data } = await supabaseAdmin
    .from('calls')
    .select('*')
    .eq('call_sid', callSid)
    .single();
  return data;
}

export async function getRecentCalls(limit = 20) {
  const { data } = await supabaseAdmin
    .from('calls')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ─── Support Tickets ─────────────────────────────────────────────
export async function createSupportTicket(
  callId: string,
  summary: string,
  issueType: string,
) {
  await supabaseAdmin
    .from('support_tickets')
    .insert({ call_id: callId, summary, issue_type: issueType });
}

export async function getSupportTickets(limit = 50) {
  const { data } = await supabaseAdmin
    .from('support_tickets')
    .select('*, calls(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function updateSupportTicket(
  ticketId: string,
  updates: Record<string, any>,
) {
  await supabaseAdmin
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId);
}

// ─── Orders ──────────────────────────────────────────────────────
export async function getOrderByNumber(orderNumber: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();
  return data;
}
