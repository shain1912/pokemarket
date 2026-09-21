import { Link } from 'react-router-dom';
import { HOME_TRUST_BADGES } from '../../data/site';
import type { CommunityReview } from '../../lib/types';
import { Icon } from '../common/Icon';

interface CommunitySectionProps {
  readonly reviews: CommunityReview[];
}

export function CommunitySection({ reviews }: CommunitySectionProps) {
  return (
    <section className="w-full px-margin py-space-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-space-sm mb-space-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="photo_camera" className="text-primary text-xl" />
              <span className="font-label-sm text-label-sm text-primary font-bold tracking-widest uppercase">TRAINER COMMUNITY</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-extrabold tracking-tight">
              트레이너들의 생생 언박싱 #포케마켓인증샷
            </h2>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
            <span>인스타그램 @pokemarket_kr</span>
            <Icon name="open_in_new" className="text-base" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {reviews.map((review) => (
            <Link
              key={review.id}
              to={`/products/${review.product.slug}`}
              className="flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src={review.photo_url ?? ''}
                  alt={`${review.author_name} 님의 인증샷`}
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-on-surface/75 backdrop-blur-sm text-surface font-label-sm text-label-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Icon name="star" filled className="text-xs text-secondary-fixed" /> {review.rating.toFixed(1)}
                </div>
              </div>
              <div className="p-space-sm flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-space-xs text-on-surface-variant font-label-sm text-label-sm">
                  <span className="font-bold text-on-surface">{review.handle ?? review.author_name}</span>
                  <span className="text-outline truncate">{review.product.short_name ?? review.product.name}</span>
                </div>
                <div className="relative bg-surface-container-low p-3 rounded text-on-surface font-body-sm text-body-sm leading-relaxed mb-space-xs">
                  "{review.content}"
                </div>
                {review.option_text && (
                  <span className="text-outline font-label-sm text-label-sm mt-auto">구매옵션: {review.option_text}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-space-xl grid grid-cols-1 md:grid-cols-3 gap-gutter p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
          {HOME_TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="flex items-center gap-space-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${badge.tone}`}>
                <Icon name={badge.icon} className="text-2xl" />
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">{badge.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{badge.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
