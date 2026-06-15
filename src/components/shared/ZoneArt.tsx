/* Stylized vector "AI-art" backdrops for each zone.
   Self-contained SVGs — sharp at any size, no external image requests. */

type ArtProps = { className?: string };

/* ── Bóng đá — sân cỏ + quả bóng ── */
export function FootballArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f8f57" />
          <stop offset="100%" stopColor="#1a6b3a" />
        </linearGradient>
        <radialGradient id="fb-glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#fb-sky)" />
      <rect width="400" height="300" fill="url(#fb-glow)" />
      {/* pitch stripes */}
      <g opacity="0.18" fill="#ffffff">
        <rect x="0" y="200" width="400" height="34" />
        <rect x="0" y="266" width="400" height="34" />
      </g>
      {/* center arc */}
      <circle cx="200" cy="300" r="120" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
      {/* ball */}
      <g transform="translate(290 90)">
        <circle r="46" fill="#ffffff" />
        <circle r="46" fill="none" stroke="#d9d4c8" strokeWidth="1.5" />
        <path d="M0 -20 L19 -6 L12 17 L-12 17 L-19 -6 Z" fill="#1f2a24" />
        <g fill="#1f2a24" opacity="0.85">
          <path d="M0 -46 L11 -28 L0 -20 L-11 -28 Z" />
          <path d="M46 -8 L30 4 L19 -6 L25 -24 Z" />
          <path d="M-46 -8 L-25 -24 L-19 -6 L-30 4 Z" />
          <path d="M28 38 L12 17 L23 30 Z" />
          <path d="M-28 38 L-23 30 L-12 17 Z" />
        </g>
      </g>
    </svg>
  );
}

/* ── Cầu lông — quả cầu + ánh sáng nhà thi đấu ── */
export function BadmintonArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bd-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c2553a" />
          <stop offset="100%" stopColor="#9c3f2b" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bd-bg)" />
      {/* court lines */}
      <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" fill="none">
        <path d="M-40 250 L180 40" />
        <path d="M120 290 L360 60" />
        <path d="M40 300 L300 30" />
      </g>
      {/* shuttlecock */}
      <g transform="translate(250 120) rotate(25)">
        <path d="M0 28 L-34 -54 Q0 -66 34 -54 Z" fill="#ffffff" opacity="0.95" />
        <g stroke="#e7e2f7" strokeWidth="1.4">
          <path d="M0 26 L-18 -48" /><path d="M0 26 L-7 -55" />
          <path d="M0 26 L7 -55" /><path d="M0 26 L18 -48" />
        </g>
        <circle cx="0" cy="30" r="13" fill="#c9a96e" />
        <circle cx="0" cy="30" r="13" fill="none" stroke="#a98a52" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* ── Tiệc cưới — vòm hoa + nhẫn cưới ── */
export function WeddingArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wd-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2c50" />
          <stop offset="100%" stopColor="#6e2440" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wd-bg)" />
      {/* arch */}
      <path d="M70 300 Q70 70 200 70 Q330 70 330 300" fill="none" stroke="#e8c8a0" strokeOpacity="0.35" strokeWidth="3" />
      {/* florals on arch */}
      <g fill="#e8d5c4" opacity="0.5">
        <circle cx="200" cy="70" r="10" /><circle cx="178" cy="76" r="7" /><circle cx="222" cy="76" r="7" />
        <circle cx="120" cy="120" r="8" /><circle cx="280" cy="120" r="8" />
      </g>
      {/* interlocked rings */}
      <g transform="translate(200 180)" fill="none" strokeWidth="9">
        <circle cx="-22" cy="0" r="34" stroke="#c9a96e" />
        <circle cx="22" cy="0" r="34" stroke="#e8c8a0" />
      </g>
      <g fill="#ffffff" opacity="0.85">
        <path d="M-22 -38 l4 7 l8 1 l-6 6 l1 8 l-7 -4 l-7 4 l1 -8 l-6 -6 l8 -1 Z" transform="scale(0.6)" />
      </g>
    </svg>
  );
}

/* ── Hero — hoạ tiết trừu tượng tông wine/vàng, gợi cả 4 khu ── */
export function HeroArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 480 360" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="hr-glow" cx="72%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#f3e3b8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f3e3b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="360" fill="url(#hr-glow)" />
      {/* concentric field/court arcs */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.3">
        <circle cx="360" cy="150" r="60" strokeWidth="2" />
        <circle cx="360" cy="150" r="110" strokeWidth="1.5" />
        <circle cx="360" cy="150" r="165" strokeWidth="1" />
      </g>
      {/* soccer ball */}
      <g transform="translate(360 150)">
        <circle r="40" fill="#f7f3ec" />
        <path d="M0 -17 L16 -5 L10 14 L-10 14 L-16 -5 Z" fill="#2b2420" />
        <g fill="#2b2420" opacity="0.85">
          <path d="M0 -40 L9 -24 L0 -17 L-9 -24 Z" />
          <path d="M40 -7 L26 4 L16 -5 L21 -21 Z" />
          <path d="M-40 -7 L-21 -21 L-16 -5 L-26 4 Z" />
        </g>
      </g>
      {/* shuttlecock */}
      <g transform="translate(180 250) rotate(20)" opacity="0.9">
        <path d="M0 18 L-22 -34 Q0 -42 22 -34 Z" fill="#e8d5c4" />
        <circle cx="0" cy="20" r="9" fill="#c9a96e" />
      </g>
      {/* rings */}
      <g transform="translate(420 285)" fill="none" strokeWidth="5" opacity="0.85">
        <circle cx="-13" cy="0" r="18" stroke="#c9a96e" />
        <circle cx="13" cy="0" r="18" stroke="#e8c8a0" />
      </g>
    </svg>
  );
}

/* ── Café — tách cà phê + hơi nóng ── */
export function CafeArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cf-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#caa86d" />
          <stop offset="100%" stopColor="#a07c45" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cf-bg)" />
      {/* steam */}
      <g stroke="#fff7ea" strokeOpacity="0.5" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M188 96 q-14 -20 0 -40 q14 -20 0 -40" />
        <path d="M214 96 q-14 -20 0 -40 q14 -20 0 -40" />
      </g>
      {/* cup */}
      <g transform="translate(200 188)">
        <path d="M-66 -30 h120 v18 q0 70 -60 70 q-60 0 -60 -70 Z" fill="#3a2417" />
        <path d="M-66 -30 h120 v10 h-120 Z" fill="#5a3a26" />
        <ellipse cx="-6" cy="-30" rx="60" ry="14" fill="#6e4a32" />
        <ellipse cx="-6" cy="-32" rx="48" ry="9" fill="#2a160c" />
        <path d="M54 -18 q40 0 40 30 q0 30 -40 26 v-14 q22 4 22 -12 q0 -16 -22 -16 Z" fill="#3a2417" />
        <ellipse cx="-6" cy="64" rx="54" ry="10" fill="#000000" opacity="0.15" />
      </g>
    </svg>
  );
}
