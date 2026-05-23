'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CallButton = dynamic(() => import('@/components/support/CallButton'), {
  ssr: false,
});

type ChatMessage = {
  text: string;
  sender: 'user' | 'bot';
  time: string;
};

export default function MessengerChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallButton, setShowCallButton] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: 'Hi! Welcome to SoHer GH 💛 How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    { text: 'Track my order', icon: 'ri-truck-line' },
    { text: 'Product inquiry', icon: 'ri-shopping-bag-line' },
    { text: 'Styling advice', icon: 'ri-magic-line' },
    { text: 'Speak to agent', icon: 'ri-customer-service-2-line' },
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Build the conversation history for the API
  function buildApiHistory() {
    return messages
      .filter((m) => m.sender !== 'bot' || messages.indexOf(m) > 0)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
  }

  async function handleSendMessage() {
    if (!message.trim()) return;
    const userText = message.trim();

    const userMsg: ChatMessage = {
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const apiMessages = [
        ...buildApiHistory(),
        { role: 'user', content: userText },
      ];

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      const botReply: ChatMessage = {
        text: data.reply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, botReply]);

      // If the AI signals escalation, show the CallButton
      if (data.escalate) {
        setShowCallButton(true);
      }
    } catch {
      const errorReply: ChatMessage = {
        text: "Sorry, I'm having trouble connecting right now. Please try again or call us at +233 20 309 7369!",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleQuickReply(text: string) {
    setMessage(text);
  }

  // Prepare chat history for Rachel (Tier 2 voice handoff)
  function getChatHistoryForRachel() {
    return messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
  }

  return (
    <>
      {/* Floating chat button — Stark minimalist */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-transform z-50 duration-300"
      >
        {isOpen ? (
          <i className="ri-close-line text-xl font-light" />
        ) : (
          <i className="ri-chat-3-line text-xl font-light" />
        )}
      </button>

      {/* Chat window — Architectural and clean */}
      {isOpen && (
        <div className="fixed bottom-[88px] right-6 w-96 h-[80vh] max-h-[600px] min-h-[500px] bg-white shadow-[0_10px_40px_rgb(0,0,0,0.08)] z-50 flex flex-col overflow-hidden border border-gray-200">
          
          {/* Header — Editorial styling */}
          <div className="bg-white border-b border-gray-100 p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-xs tracking-[0.2em] uppercase text-black">
                SoHer Concierge
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                <p className="text-[10px] tracking-widest text-gray-500 uppercase">
                  {isTyping ? 'Typing...' : 'AI Assistant Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
            >
              <i className="ri-subtract-line text-lg" />
            </button>
          </div>

          {/* Messages Container — Stark white background */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white shrink-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-5 py-3.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-50 border border-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 tracking-wider">
                    {msg.sender === 'user' ? 'YOU' : 'AI'} • {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator — Minimalist dots */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Call Button (Rachel voice handoff) */}
            {showCallButton && (
              <div className="flex flex-col items-center gap-3 py-4 border-t border-gray-100 mt-4">
                <p className="text-[11px] uppercase tracking-widest text-gray-500 text-center">
                  Live Voice Assistance Available
                </p>
                <div className="w-full">
                  <CallButton chatHistory={getChatHistoryForRachel()} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area — Structural and geometric */}
          <div className="border-t border-gray-100 bg-white p-4">
            
            {/* Quick replies — Sharp borders, uppercase text */}
            {messages.length <= 2 && !showCallButton && !isTyping && (
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.text)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-black/10 hover:border-black text-black text-[10px] uppercase tracking-wider transition-colors duration-200"
                  >
                    <i className={`${reply.icon} text-sm`} />
                    <span>{reply.text}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-stretch gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  showCallButton
                    ? 'Start voice call above...'
                    : 'Type your message...'
                }
                className="flex-1 px-4 py-3 bg-gray-50 border border-black/5 focus:bg-white focus:border-black focus:ring-0 text-sm transition-colors duration-200 outline-none rounded-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !message.trim()}
                className="px-5 flex items-center justify-center bg-black hover:bg-gray-900 disabled:bg-gray-200 text-white transition-colors duration-200 rounded-none"
              >
                <i className="ri-arrow-right-line text-lg font-light" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}