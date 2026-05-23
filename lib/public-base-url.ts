/**
 * Public https base (no trailing slash). Used for Twilio action URLs and similar.
 */
export function getPublicBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  if (!raw) return '';
  return raw.replace(/\/$/, '');
}
