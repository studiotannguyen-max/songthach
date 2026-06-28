type IconProps = { size?: number; color?: string };

export function FootballIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5"/>
      <path d="M12 4.5L15 9H9L12 4.5Z" fill={color}/>
      <path d="M9 9L5.5 11.5L7 16H12H17L18.5 11.5L15 9" stroke={color} strokeWidth="2" strokeLinejoin="miter" fill="none"/>
      <path d="M7 16L9 19.5M17 16L15 19.5M12 16V19.5" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
