import { Icon } from './Icon';

interface StarsProps {
  readonly rating: number;
  readonly sizeClass?: string;
}

export function Stars({ rating, sizeClass = 'text-base' }: StarsProps) {
  const rounded = Math.round(rating);
  return (
    <div className="flex text-secondary-fixed-dim" aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" filled={n <= rounded} className={sizeClass} />
      ))}
    </div>
  );
}
