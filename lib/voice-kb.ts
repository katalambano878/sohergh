type ReplyRule = {
  keywords: string[];
  reply: string;
};

const RULES: ReplyRule[] = [
  {
    keywords: ['return', 'exchange', 'send it back'],
    reply:
      'I can handle that return right now. Please share your order number and the reason for the return, and I will guide you through the exact next step.',
  },
  {
    keywords: ['refund', 'money back', 'reimburse'],
    reply:
      'I can help with that refund now. Please share your order number and I will confirm the refund eligibility and timeline for you.',
  },
  {
    keywords: ['shipping', 'delivery time', 'when will it arrive', 'arrive'],
    reply:
      'I can check shipping details for you right away. Please share your order number and I will confirm the latest delivery status.',
  },
  {
    keywords: ['cancel order', 'cancellation', 'cancel my order'],
    reply:
      'I can help with cancellation. Please share your order number and I will check if it is still eligible to cancel before shipment.',
  },
  {
    keywords: ['payment', 'pay', 'card', 'bank transfer', 'checkout'],
    reply:
      'I can help with payment questions now. Tell me the issue you are seeing at checkout and I will walk you through it.',
  },
  {
    keywords: ['account', 'login', 'password', 'sign in'],
    reply:
      'I can help with your account right away. Tell me exactly what is failing and I will guide you step by step.',
  },
  {
    keywords: ['product', 'size', 'color', 'available', 'stock'],
    reply:
      'I can help with product details. Tell me the product name and what you want to confirm, and I will assist immediately.',
  },
];

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p));
}

/**
 * Deterministic "no-thinking" support reply using website-style support intents.
 * Returns null when there is no strong rule match.
 */
export function getInstantKbReply(input: string, orderContext: string): string | null {
  const lower = input.toLowerCase();

  if (
    orderContext &&
    includesAny(lower, ['order', 'tracking', 'where is my order', 'delivery', 'status'])
  ) {
    return orderContext;
  }

  const rule = RULES.find((r) => includesAny(lower, r.keywords));
  if (rule) return rule.reply;

  return null;
}

export const GENERIC_INSTANT_REPLY =
  'I can help with orders, shipping, returns, refunds, product questions, and account issues right now. Please tell me your order number and what you need help with.';

