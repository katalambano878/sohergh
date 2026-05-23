const FRUSTRATED_KEYWORDS = [
  'angry', 'furious', 'terrible', 'unacceptable', 'useless', 'ridiculous',
  'worst', 'horrible', 'disgusting', 'incompetent', 'pathetic', 'awful',
  'never again', 'waste of time', 'so frustrated', 'very upset',
];

const POSITIVE_KEYWORDS = [
  'thank you', 'thanks', 'great', 'helpful', 'wonderful', 'appreciate',
  'perfect', 'awesome', 'brilliant', 'excellent', 'amazing', 'love it',
];

export function analyzeSentiment(
  transcript: string,
): 'positive' | 'neutral' | 'frustrated' {
  const lower = transcript.toLowerCase();
  const frustratedCount = FRUSTRATED_KEYWORDS.filter((k) =>
    lower.includes(k),
  ).length;
  const positiveCount = POSITIVE_KEYWORDS.filter((k) =>
    lower.includes(k),
  ).length;
  if (frustratedCount >= 2) return 'frustrated';
  if (positiveCount >= 2) return 'positive';
  return 'neutral';
}
