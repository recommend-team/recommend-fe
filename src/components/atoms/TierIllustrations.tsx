/**
 * The registration-tier pictures: a small stall with a phone on the counter for sellers
 * who are not registered, a shopfront with a verified seal for registered businesses.
 * Drawn rather than photographed, in the brand colours, so they portray no one.
 */

const INK = "#1A1A1A";
const ORANGE = "#EF5A22";
const GREEN = "#006837";

export function StallIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="A small food stall with a phone on the counter"
    >
      <circle cx="80" cy="84" r="66" fill="#FFE7A3" />
      <line x1="38" y1="56" x2="38" y2="112" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="122" y1="56" x2="122" y2="112" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="28" y="38" width="104" height="18" rx="3" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      {[31, 59, 87, 115].map((x) => (
        <rect key={x} x={x} y="40" width="14" height="15" fill={ORANGE} />
      ))}
      <path
        d="M28 56 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 q4 6 6 0"
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="24" y="108" width="112" height="22" rx="5" fill={GREEN} stroke={INK} strokeWidth="3" />
      <rect x="50" y="88" width="34" height="20" rx="6" fill={INK} />
      <line x1="46" y1="88" x2="88" y2="88" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M60 80 q-4 -6 0 -12 M68 80 q-4 -6 0 -12 M76 80 q-4 -6 0 -12"
        fill="none"
        stroke={ORANGE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="98" y="74" width="22" height="34" rx="4" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <rect x="102" y="82" width="14" height="8" rx="3" fill={ORANGE} />
      <rect x="102" y="93" width="10" height="5" rx="2" fill={GREEN} />
    </svg>
  );
}

export function StorefrontIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="A shopfront with a verified seal"
    >
      <circle cx="80" cy="86" r="66" fill="#DCEFE3" />
      <rect x="32" y="56" width="96" height="74" rx="4" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <rect x="26" y="44" width="108" height="18" rx="3" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      {[29, 59, 89].map((x) => (
        <rect key={x} x={x} y="46" width="15" height="15" fill={GREEN} />
      ))}
      <rect x="119" y="46" width="12" height="15" fill={GREEN} />
      <rect x="42" y="76" width="24" height="20" rx="3" fill="#FFE7A3" stroke={INK} strokeWidth="3" />
      <rect x="94" y="76" width="24" height="20" rx="3" fill="#FFE7A3" stroke={INK} strokeWidth="3" />
      <rect x="70" y="92" width="20" height="38" rx="2" fill={GREEN} stroke={INK} strokeWidth="3" />
      <circle cx="85" cy="112" r="2" fill="#FFFFFF" />
      <circle cx="124" cy="42" r="19" fill={ORANGE} stroke={INK} strokeWidth="3" />
      <path
        d="M115 42 l6 6 l11 -12"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
