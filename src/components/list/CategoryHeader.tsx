import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';

export interface ListHeading {
  emoji: string;
  name: string;
  nameEn?: string | null;
  description: string;
}

interface CategoryHeaderProps {
  readonly heading: ListHeading;
}

const HIGHLIGHTS = [
  { icon: 'local_shipping', iconClass: 'text-tertiary', filled: false, label: '몬스터볼 특급', value: '오늘 15시 마감' },
  { icon: 'stars', iconClass: 'text-secondary-container', filled: true, label: '첫 구매 혜택', value: '스티커 3종 동봉' },
];

export function CategoryHeader({ heading }: CategoryHeaderProps) {
  return (
    <section className="mb-space-lg">
      <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm mb-space-sm" aria-label="breadcrumb">
        <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/">
          <Icon name="home" className="text-base" />홈
        </Link>
        <Icon name="chevron_right" className="text-xs text-outline" />
        <Link className="hover:text-primary transition-colors" to="/products">
          전체 카테고리
        </Link>
        <Icon name="chevron_right" className="text-xs text-outline" />
        <span className="text-primary font-bold">{heading.name}</span>
      </nav>

      <div className="relative overflow-hidden rounded-lg bg-surface-container-low p-space-lg md:p-space-xl shadow-sm">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
        <div className="absolute right-24 -bottom-10 w-36 h-36 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm w-fit">
              <Icon name="favorite" filled className="text-sm" />
              트레이너 만족도 99.4% 공식 정품 부티크
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface flex items-center flex-wrap gap-space-sm">
              <span>
                {heading.emoji} {heading.name}
              </span>
              {heading.nameEn && (
                <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline-block font-normal">
                  {heading.nameEn}
                </span>
              )}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{heading.description}</p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-space-md py-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
                <Icon name={item.icon} filled={item.filled} className={`text-2xl ${item.iconClass}`} />
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">{item.label}</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
