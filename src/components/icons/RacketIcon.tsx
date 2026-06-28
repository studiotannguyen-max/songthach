type IconProps = { size?: number; color?: string };

export function RacketIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="8.5" rx="5.5" ry="7" transform="rotate(-40 9 8.5)" stroke={color} strokeWidth="2.5"/>
      <line x1="8" y1="14" x2="6" y2="16" stroke={color} strokeWidth="2"/>
      <line x1="11" y1="11" x2="9" y2="13" stroke={color} strokeWidth="2"/>
      <line x1="13" y1="14" x2="20" y2="21" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}
