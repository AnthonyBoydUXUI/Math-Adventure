/** HUD stamp only. Matches locked Signal identity. */
export function CastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#0e1a3a" />
      <path d="M10 28c2-14 26-14 28 0v6H10z" fill="#e8e4dc" />
      <path d="M16 16c4-8 12-8 16 0l2 6H14z" fill="#e8e4dc" />
      <path d="M18 20h12l-6-5z" fill="#e4c24a" />
      <circle cx="20" cy="26" r="3.1" fill="#fff4ea" />
      <circle cx="28" cy="26" r="3.1" fill="#fff4ea" />
      <circle cx="20.2" cy="26.1" r="1.7" fill="#c48a2a" />
      <circle cx="28.2" cy="26.1" r="1.7" fill="#c48a2a" />
    </svg>
  )
}
