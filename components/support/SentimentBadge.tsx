type Sentiment = 'positive' | 'neutral' | 'frustrated';

const config = {
  positive: { label: 'Positive', classes: 'bg-green-50 text-green-700' },
  neutral: { label: 'Neutral', classes: 'bg-gray-100 text-gray-600' },
  frustrated: { label: 'Frustrated', classes: 'bg-red-50 text-red-600' },
};

export default function SentimentBadge({
  sentiment,
}: {
  sentiment: Sentiment;
}) {
  const { label, classes } = config[sentiment];
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${classes}`}
    >
      {label}
    </span>
  );
}
