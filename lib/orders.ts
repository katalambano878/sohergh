import { getOrderByNumber } from './supabase-support';

export function extractOrderNumber(text: string): string | null {
  const match = text.match(/\b([A-Z0-9]{5,12})\b/i);
  return match ? match[1].toUpperCase() : null;
}

export function formatOrderForSpeech(order: any): string {
  if (!order) {
    return "I wasn't able to find an order with that number. Could you double-check it for me?";
  }
  const items = Array.isArray(order.items)
    ? order.items.map((i: any) => i.name || i).join(', ')
    : 'your items';
  const delivery = order.estimated_delivery
    ? `estimated to arrive by ${new Date(
        order.estimated_delivery,
      ).toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}`
    : 'with delivery details being updated';
  const tracking = order.tracking_number
    ? `Your tracking number is ${order.tracking_number}.`
    : '';
  return `Your order for ${items} is currently ${order.status}, ${delivery}. ${tracking}`.trim();
}

export async function lookupOrder(orderNumber: string): Promise<string> {
  const order = await getOrderByNumber(orderNumber);
  return formatOrderForSpeech(order);
}
