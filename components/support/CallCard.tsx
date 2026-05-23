import SentimentBadge from './SentimentBadge';

export default function CallCard({ call }: { call: any }) {
  const duration = call.ended_at
    ? Math.round(
        (new Date(call.ended_at).getTime() -
          new Date(call.started_at).getTime()) /
          1000,
      )
    : null;

  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400">
          {call.call_sid.slice(0, 16)}...
        </span>
        <SentimentBadge sentiment={call.sentiment ?? 'neutral'} />
      </div>
      {call.reason && (
        <p className="text-sm text-gray-700">{call.reason}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            call.status === 'active'
              ? 'bg-green-400 animate-pulse'
              : call.status === 'transferred'
                ? 'bg-amber-400'
                : 'bg-gray-300'
          }`}
        />
        <span className="capitalize">{call.status}</span>
        {duration && <span>{duration}s</span>}
        <span>{new Date(call.started_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
