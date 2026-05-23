import type { ChatMessage } from './groq';

const sessions = new Map<string, ChatMessage[]>();

export function getSession(callSid: string): ChatMessage[] {
  if (!sessions.has(callSid)) {
    sessions.set(callSid, []);
  }
  return sessions.get(callSid)!;
}

export function addMessage(
  callSid: string,
  role: 'user' | 'assistant',
  content: string,
): void {
  const session = getSession(callSid);
  session.push({ role, content });
}

export function clearSession(callSid: string): void {
  sessions.delete(callSid);
}
