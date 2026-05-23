'use client';

import { useState, useRef } from 'react';

type Message = { role: string; content: string };
interface CallButtonProps {
  chatHistory?: Message[];
}
type CallState = 'idle' | 'loading' | 'connected' | 'transferring' | 'ended' | 'error';

export default function CallButton({ chatHistory = [] }: CallButtonProps) {
  const [state, setState] = useState<CallState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const deviceRef = useRef<any>(null);

  function cleanup() {
    try { deviceRef.current?.destroy(); } catch {}
    deviceRef.current = null;
  }

  async function startCall() {
    setState('loading');
    setErrorMsg('');
    cleanup();

    try {
      const { Device } = await import('@twilio/voice-sdk');

      // ── 1. Fetch Twilio access token ──────────────────────────────
      const chatContext = chatHistory.map((m) => `${m.role}: ${m.content}`).join('\n');
      const tokenRes = await fetch('/support/api/twilio/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatHistory: chatContext }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        throw new Error(`Token fetch failed (${tokenRes.status}): ${err}`);
      }

      const { token } = await tokenRes.json();
      if (!token) throw new Error('No token returned from server');

      // ── 2. Init Twilio Device ─────────────────────────────────────
      const device = new Device(token, {
        logLevel: 1,
        edge: ['ashburn', 'dublin', 'singapore'],
      });
      deviceRef.current = device;

      device.on('error', (err: any) => {
        console.error('[Twilio Device error]', err);
        setErrorMsg(err?.message ?? String(err));
        setState('error');
        cleanup();
      });

      // ── 3. Connect (outgoing call hits TwiML App) ─────────────────
      const call = await device.connect({ params: { To: 'support', chatContext } });

      call.on('accept',     () => setState('connected'));
      call.on('disconnect', () => { setState('ended'); cleanup(); });
      call.on('cancel',     () => { setState('idle');  cleanup(); });
      call.on('error',      (err: any) => {
        console.error('[Twilio Call error]', err);
        setErrorMsg(err?.message || (err?.code ? `Code ${err.code}` : 'Call error'));
        setState('error');
        cleanup();
      });

    } catch (err: any) {
      console.error('[startCall error]', err);
      setErrorMsg(err?.message ?? String(err));
      setState('error');
      cleanup();
    }
  }

  function endCall() {
    deviceRef.current?.disconnectAll();
    cleanup();
    setState('ended');
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-gray-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] w-full rounded-none">
      {state === 'idle' && (
        <>
          <div className="w-12 h-12 bg-black flex items-center justify-center mb-1">
            <i className="ri-mic-2-line text-xl font-light text-white" />
          </div>
          <div className="text-[11px] text-gray-500 text-center uppercase tracking-widest leading-relaxed">
            Connect via Voice
          </div>
          <button
            onClick={startCall}
            className="w-full py-3 px-6 bg-black text-white text-[11px] uppercase tracking-widest font-bold hover:bg-gray-900 transition-colors duration-300 rounded-none mt-2"
          >
            Start Call
          </button>
        </>
      )}

      {state === 'loading' && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse delay-150" />
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest">
            Establishing Connection
          </div>
        </div>
      )}

      {state === 'connected' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute inset-0 border border-green-500 rounded-full animate-ping opacity-20" />
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-black">
              Call Connected
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
            <i className="ri-mic-line" />
            <span>AI Listening</span>
          </div>
          <button
            onClick={endCall}
            className="w-full py-3 px-6 bg-white border border-gray-200 text-black text-[11px] uppercase tracking-widest font-bold hover:bg-gray-50 hover:border-black transition-colors duration-300 rounded-none mt-2"
          >
            End Call
          </button>
        </>
      )}

      {state === 'transferring' && (
        <div className="text-[10px] text-gray-500 text-center py-6 uppercase tracking-widest leading-relaxed">
          Transferring to Human Agent...
        </div>
      )}

      {state === 'ended' && (
        <>
          <div className="text-[11px] text-gray-600 text-center uppercase tracking-wider leading-relaxed">
            Call Terminated
          </div>
          <button
            onClick={() => setState('idle')}
            className="text-[10px] text-black border-b border-black uppercase tracking-widest pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors mt-2"
          >
            Start New Call
          </button>
        </>
      )}

      {state === 'error' && (
        <>
          <div className="text-[11px] text-red-500 text-center uppercase tracking-wider">
            Connection Failed
          </div>
          {errorMsg && (
            <div className="text-[10px] text-gray-400 text-center max-w-xs break-words">
              {errorMsg}
            </div>
          )}
          <button
            onClick={() => setState('idle')}
            className="w-full py-3 px-6 bg-white border border-gray-200 text-black text-[11px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors duration-300 rounded-none mt-2"
          >
            Retry Connection
          </button>
        </>
      )}
    </div>
  );
}
