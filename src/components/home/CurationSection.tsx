import { Link } from 'react-router-dom';
import type { Banner } from '../../lib/types';
import { Icon } from '../common/Icon';

interface CurationSectionProps {
  readonly banners: Banner[];
}

const TONES = {
  secondary: {
    card: 'to-secondary-fixed/30',
    iconWrap: 'bg-secondary-container text-on-secondary-container',
    eyebrow: 'text-secondary',
  },
  primary: {
    card: 'to-primary-fixed/30',
    iconWrap: 'bg-primary-container text-on-primary',
    eyebrow: 'text-primary',
  },
};

export function CurationSection({ banners }: CurationSectionProps) {
  if (banners.length === 0) return null;

  return (
    <section className="w-full px-margin py-space-lg bg-surface-container-low/60">
      <div className="max-w-7xl mx-auto">
        <div className="mb-space-lg text-center max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            CURATED THEMES
          </span>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-extrabold mt-space-xs mb-1">
            트레이너 일상을 바꾸는 라이프스타일 큐레이션
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            책상 위 작업실부터 따스한 홈카페 테이블까지, 포켓몬과 함께 채워보세요.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {banners.map((banner) => {
            const tone = TONES[banner.tone] ?? TONES.primary;
            return (
              <Link
                key={banner.id}
                to={banner.cta_href ?? '/products'}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-lowest ${tone.card} p-space-lg shadow-md flex flex-col justify-between group`}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-space-sm">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center ${tone.iconWrap}`}>
                      <Icon name={banner.icon ?? 'auto_awesome'} className="text-base" />
                    </span>
                    <span className={`font-label-md text-label-md font-bold ${tone.eyebrow}`}>{banner.eyebrow}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-2 whitespace-pre-line">{banner.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-space-md">{banner.body}</p>
                  <span className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary font-bold group-hover:translate-x-1 transition-transform">
                    <span>{banner.cta_label}</span>
                    <Icon name="arrow_forward" className="text-lg" />
                  </span>
                </div>
                <div className="mt-space-md pt-space-md relative flex justify-end">
                  <div className="w-full h-48 rounded-lg overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={banner.image_url}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
