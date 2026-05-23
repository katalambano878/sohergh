import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import {
  CHATBOT_SYSTEM_PROMPT,
  chatbotShouldEscalate,
  cleanChatbotResponse,
} from '@/lib/chatbot-prompts';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        {
          reply:
            "I'm sorry, our chat system is currently being set up. Please contact us at info@sohergh.com or call +233 20 309 7369 for immediate help!",
          escalate: false,
        },
        { status: 200 },
      );
    }

    // Build Groq messages array
    const groqMessages = [
      { role: 'system' as const, content: CHATBOT_SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.7,
      messages: groqMessages,
    });

    const rawReply = response.choices[0].message.content ?? '';
    const escalate = chatbotShouldEscalate(rawReply);
    const reply = cleanChatbotResponse(rawReply);

    return Response.json({ reply, escalate });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return Response.json(
      {
        reply:
          "I'm having a little trouble right now. You can reach us directly at info@sohergh.com or call +233 20 309 7369!",
        escalate: false,
      },
      { status: 200 },
    );
  }
}
