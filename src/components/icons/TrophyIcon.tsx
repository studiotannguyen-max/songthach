type IconProps = { size?: number; color?: string };

export function TrophyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3H19V11C19 14.3137 15.866 17 12 17C8.13401 17 5 14.3137 5 11V3Z" stroke={color} strokeWidth="2.5" strokeLinejoin="miter"/>
      <path d="M5 6H2V10C2 11.6569 3.34315 13 5 13" stroke={color} strokeWidth="2.5"/>
      <path d="M19 6H22V10C22 11.6569 20.6569 13 19 13" stroke={color} strokeWidth="2.5"/>
      <line x1="12" y1="17" x2="12" y2="20" stroke={color} strokeWidth="2.5"/>
      <line x1="7" y1="20" x2="17" y2="20" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}
