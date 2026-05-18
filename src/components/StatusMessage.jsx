const TONE_CLASSES = {
  info: "bg-white text-slate-600",
  error: "bg-red-50 text-red-600",
  success: "bg-emerald-50 text-emerald-700",
};

export default function StatusMessage({
  tone = "info",
  message,
  className = "",
}) {
  if (!message) {
    return null;
  }

  const toneClasses = TONE_CLASSES[tone] || TONE_CLASSES.info;

  return (
    <p
      className={`rounded-2xl p-4 text-sm shadow-sm ${toneClasses} ${className}`}
    >
      {message}
    </p>
  );
}

export function FeedbackBanner({ error, successMessage, className = "" }) {
  if (!error && !successMessage) {
    return null;
  }

  return (
    <StatusMessage
      tone={error ? "error" : "success"}
      message={error || successMessage}
      className={className}
    />
  );
}
