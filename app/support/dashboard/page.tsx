import { getRecentCalls, getSupportTickets } from '@/lib/supabase-support';
import CallCard from '@/components/support/CallCard';
import TicketList from '@/components/support/TicketList';

export const revalidate = 30;

export default async function SupportDashboard() {
  const [calls, tickets] = await Promise.all([
    getRecentCalls(20),
    getSupportTickets(50),
  ]);

  const activeCalls = calls.filter((c: any) => c.status === 'active').length;
  const transferredCalls = calls.filter((c: any) => c.transferred).length;
  const openTickets = tickets.filter((t: any) => !t.resolved).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Voice Support Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Rachel AI — live calls, transcripts, and tickets
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total calls today', value: calls.length },
          { label: 'Active calls', value: activeCalls },
          { label: 'Transferred', value: transferredCalls },
          { label: 'Open tickets', value: openTickets },
        ].map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1"
          >
            <span className="text-xs text-gray-400">{metric.label}</span>
            <span className="text-2xl font-medium text-gray-900">
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent calls */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-gray-900">Recent calls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {calls.map((call: any) => (
            <CallCard key={call.id} call={call} />
          ))}
          {calls.length === 0 && (
            <p className="text-sm text-gray-400">No calls yet</p>
          )}
        </div>
      </div>

      {/* Support tickets */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-gray-900">Support tickets</h2>
        <TicketList />
      </div>
    </div>
  );
}
