import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { splitHighlight } from '../../lib/format';
import type { Banner } from '../../lib/types';
import { Icon } from '../common/Icon';

interface HeroCarouselProps {
  readonly banners: Banner[];
  readonly intervalMs?: number;
}

export function HeroCarousel({ banners, intervalMs = 6000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % banners.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, banners.length, intervalMs]);

  const banner = banners[index % Math.max(banners.length, 1)];
  if (!banner) return <div className="rounded-xl bg-surface-container-low min-h-[440px] animate-pulse" />;

  const [promoBefore, promoStrong, promoAfter] = splitHighlight(banner.promo_text ?? '', banner.promo_highlight);

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-low via-secondary-fixed/40 to-primary-fixed/50 shadow-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-secondary-fixed-dim/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-80 h-80 rounded-full bg-primary-fixed/40 blur-2xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center min-h-[440px] p-space-lg lg:p-space-xl gap-space-lg">
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
            {banner.eyebrow && (
              <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm">
                {banner.icon && <Icon name={banner.icon} className="text-sm" />} {banner.eyebrow}
              </span>
            )}
            {banner.tag_text && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                <Icon name="redeem" className="text-sm" /> {banner.tag_text}
              </span>
            )}
          </div>

          <h1 key={banner.id} className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-on-surface tracking-tight leading-tight mb-space-xs">
            {banner.title.split('\n').map((line, lineIndex) => {
              const [before, strong, after] = splitHighlight(line, banner.title_highlight);
              return (
                <span key={lineIndex} className="block">
                  {before}
                  {strong && <span className="text-primary font-extrabold">{strong}</span>}
                  {after}
                </span>
              );
            })}
          </h1>
          {banner.body && (
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-lg">{banner.body}</p>
          )}

          <div className="flex flex-wrap items-center gap-space-md">
            {banner.cta_label && banner.cta_href && (
              <Link
                to={banner.cta_href}
                className="px-8 py-4 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>{banner.cta_label}</span>
                <Icon name="arrow_forward" className="text-xl" />
              </Link>
            )}
            {banner.promo_text && (
              <div className="flex items-center gap-space-xs px-4 py-3 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface-variant font-label-md text-label-md shadow-sm">
                <Icon name="celebration" className="text-tertiary" />
                <span>
                  {promoBefore}
                  {promoStrong && <strong className="text-primary font-bold">{promoStrong}</strong>}
                  {promoAfter}
                </span>
              </div>
            )}
          </div>

          {banners.length > 1 && (
            <div className="flex items-center gap-2 mt-space-lg">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`${i + 1}번 배너 보기`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-primary' : 'w-2.5 bg-on-surface-variant/30 hover:bg-primary'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-xl bg-surface-container-lowest p-2">
            <img key={banner.id} className="w-full h-full object-cover rounded-lg" src={banner.image_url} alt={banner.title.replace('\n', ' ')} />
            {banner.image_badge_top && (
              <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-primary font-label-sm text-label-sm">
                <Icon name="stars" className="text-sm" /> {banner.image_badge_top}
              </div>
            )}
            {banner.image_badge_bottom && (
              <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-ping" />
                <span className="font-label-sm text-label-sm text-on-surface font-bold">{banner.image_badge_bottom}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
