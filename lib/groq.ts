import Groq from 'groq-sdk';
import { RACHEL_SYSTEM_PROMPT } from './prompts';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY?.trim() });

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const CHAT_MODEL = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant';

export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    max_tokens: 80,
    temperature: 0.5,
    messages: [
      { role: 'system', content: RACHEL_SYSTEM_PROMPT },
      ...messages,
    ],
  });
  return response.choices[0].message.content ?? '';
}

export async function generateGreeting(chatHistory: string): Promise<string> {
  const prompt = chatHistory
    ? `The customer was just chatting with our bot. Here is the conversation:\n${chatHistory}\n\nGenerate a warm greeting (1 sentence) that shows you know their issue. Do not ask them to repeat themselves.`
    : 'A customer just called in. Greet them warmly in 1 sentence and ask how you can help.';

  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    max_tokens: 50,
    temperature: 0.5,
    messages: [
      { role: 'system', content: RACHEL_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
  });
  return (
    response.choices[0].message.content ??
    'Hi there! Thanks for calling Sohergh. How can I help you today?'
  );
}

export async function generateTicketSummary(
  transcript: string,
): Promise<{ summary: string; issueType: string }> {
  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    max_tokens: 100,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `Summarize this support call in 2 sentences as a support ticket.
Then on a new line write: ISSUE_TYPE: followed by one of:
order, complaint, product, account, general

Transcript:
${transcript}`,
      },
    ],
  });
  const text = response.choices[0].message.content ?? '';
  const lines = text.split('\n').filter(Boolean);
  const issueTypeLine = lines.find((l: string) => l.startsWith('ISSUE_TYPE:'));
  const issueType = issueTypeLine
    ? issueTypeLine.replace('ISSUE_TYPE:', '').trim().toLowerCase()
    : 'general';
  const summary = lines
    .filter((l: string) => !l.startsWith('ISSUE_TYPE:'))
    .join(' ')
    .trim();
  return { summary, issueType };
}
