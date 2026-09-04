/** HUD stamp only. The hero lives in the Three.js cast, not this icon. */
export function CastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#0e1a3a" />
      <path d="M14 22c1-9 19-9 20 1-1 6-5 9-10 9s-9-3-10-10z" fill="#c17a48" />
      <path d="M13 18c4-10 18-9 20 2-6-3-14-2-20 2z" fill="#12161c" />
      <path d="M18 12c2-2 6-1 8 2 1 2-1 4-4 3-3-2-5-3-4-5z" fill="#e4c24a" />
      <ellipse cx="20" cy="22" rx="3.2" ry="2.4" fill="#fff4ea" />
      <ellipse cx="28" cy="22" rx="3.2" ry="2.4" fill="#fff4ea" />
      <ellipse cx="20.2" cy="22.1" rx="1.7" ry="1.6" fill="#4a2c18" />
      <ellipse cx="28.2" cy="22.1" rx="1.7" ry="1.6" fill="#4a2c18" />
    </svg>
  )
}
