interface IconProps {
  readonly name: string;
  readonly className?: string;
  readonly filled?: boolean;
}

/** Material Symbols Outlined 아이콘 */
export function Icon({ name, className = '', filled = false }: IconProps) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${filled ? 'is-filled' : ''} ${className}`}>
      {name}
    </span>
  );
}
