/** HUD stamp only. The hero lives in the Three.js cast, not this icon. */
export function CastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#0e1a3a" />
      <circle cx="24" cy="20" r="10" fill="#c68642" />
      <path d="M15 18c3-8 15-8 18 0" fill="#161b2e" />
      <rect x="15" y="18" width="18" height="3" rx="1" fill="#e4c24a" />
    </svg>
  )
}
