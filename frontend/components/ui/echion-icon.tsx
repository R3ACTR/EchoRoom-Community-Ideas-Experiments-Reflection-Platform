export default function EchionIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="echionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A9AFF" />
          <stop offset="50%" stopColor="#2F7CF6" />
          <stop offset="100%" stopColor="#0992C2" />
        </linearGradient>
      </defs>

      <circle
        cx="12"
        cy="12"
        r="2"
        stroke="url(#echionGradient)"
        strokeWidth="1.8"
      />
      <path
        d="M5 12a7 7 0 0 1 14 0"
        stroke="url(#echionGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 12a9 9 0 0 1 18 0"
        stroke="url(#echionGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}