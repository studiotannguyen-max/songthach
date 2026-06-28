type IconProps = { size?: number; color?: string };

export function ShuttlecockIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="19" r="2.5" stroke={color} strokeWidth="2.5"/>
      <line x1="12" y1="16.5" x2="12" y2="10" stroke={color} strokeWidth="2.5"/>
      <path d="M7.5 10.5L12 3L16.5 10.5" stroke={color} strokeWidth="2.5" strokeLinejoin="miter" fill="none"/>
      <line x1="8" y1="8.5" x2="16" y2="8.5" stroke={color} strokeWidth="2"/>
      <line x1="7.5" y1="10.5" x2="16.5" y2="10.5" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
