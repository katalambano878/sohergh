'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FILTERS = [
  'all',
  'order',
  'complaint',
  'product',
  'account',
  'transfer',
];

export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase
      .from('support_tickets')
      .select('*, calls(*)')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setTickets(data ?? []));
  }, []);

  const filtered =
    filter === 'all'
      ? tickets
      : tickets.filter((t) => t.issue_type === filter);

  async function toggleResolved(ticket: any) {
    await supabase
      .from('support_tickets')
      .update({ resolved: !ticket.resolved })
      .eq('id', ticket.id);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id ? { ...t, resolved: !t.resolved } : t,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === f
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-700 flex-1">
                {ticket.summary}
              </p>
              <button
                onClick={() => toggleResolved(ticket)}
                className={`text-xs px-3 py-1 rounded-full border flex-shrink-0 transition-colors ${
                  ticket.resolved
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                }`}
              >
                {ticket.resolved ? 'Resolved' : 'Mark resolved'}
              </button>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="capitalize bg-gray-50 px-2 py-0.5 rounded-full">
                {ticket.issue_type}
              </span>
              <span>
                {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No tickets found
          </p>
        )}
      </div>
    </div>
  );
}
