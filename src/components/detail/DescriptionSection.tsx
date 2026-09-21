import { splitHighlight } from '../../lib/format';
import type { ProductFull } from '../../lib/types';
import { Icon } from '../common/Icon';

interface DescriptionSectionProps {
  readonly product: ProductFull;
}

const FEATURE_TONES = {
  primary: { badge: 'bg-primary text-on-primary', note: 'text-primary' },
  secondary: { badge: 'bg-secondary text-on-secondary', note: 'text-secondary' },
  tertiary: { badge: 'bg-tertiary text-on-tertiary', note: 'text-tertiary' },
};

/** 상세설명 탭: 스토리 배너 → 특징 카드 → 스펙/사이즈 가이드. 상품에 없는 블록은 건너뛴다 */
export function DescriptionSection({ product }: DescriptionSectionProps) {
  const { story, features, features_title, specs, size_guide } = product.detail;

  return (
    <div className="mt-space-xl flex flex-col gap-space-xl scroll-mt-52" id="tab-desc">
      {story ? (
        <div className="w-full rounded-xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low p-space-lg md:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
          <div className="flex flex-col gap-space-sm max-w-xl">
            <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold w-max">{story.eyebrow}</span>
            <h2 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-surface font-extrabold tracking-tight">
              {story.title.split('\n').map((line, i) => {
                const [before, strong, after] = splitHighlight(line, story.highlight);
                return (
                  <span key={i} className="block">
                    {before}
                    {strong && <span className="text-primary">{strong}</span>}
                    {after}
                  </span>
                );
              })}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{story.body}</p>
          </div>
          <div className="w-72 h-72 rounded-full bg-surface-container-lowest/80 p-3 shadow-inner flex items-center justify-center shrink-0">
            <img className="w-full h-full object-cover rounded-full" src={story.image} alt="" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low p-space-lg md:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
          <div className="flex flex-col gap-space-sm max-w-xl">
            <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold w-max">
              POKÉ MARKET PICK
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">{product.short_name ?? product.name}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{product.subtitle}</p>
          </div>
          <div className="w-72 h-72 rounded-full bg-surface-container-lowest/80 p-3 shadow-inner flex items-center justify-center shrink-0">
            <img className="w-full h-full object-cover rounded-full" src={product.image_url} alt="" loading="lazy" />
          </div>
        </div>
      )}

      {features && features.length > 0 && (
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <h3 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface font-bold">
              {features_title ?? '이 굿즈의 특별한 디테일'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {features.map((feature) => {
              const tone = FEATURE_TONES[feature.tone] ?? FEATURE_TONES.primary;
              return (
                <div
                  key={feature.point}
                  className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-md transition-all hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-video rounded bg-surface-container-low overflow-hidden">
                    <img className="w-full h-full object-cover" src={feature.image} alt="" loading="lazy" />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${tone.badge}`}>
                      {feature.point}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">{feature.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{feature.body}</p>
                  </div>
                  <div className={`mt-auto pt-2 flex items-center gap-2 font-label-sm text-label-sm font-bold ${tone.note}`}>
                    <Icon name={feature.icon} className="text-base" />
                    <span>{feature.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {specs && specs.length > 0 && (
        <div className="p-space-lg md:p-space-xl rounded-lg bg-surface-container-low flex flex-col gap-space-lg">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-primary font-bold">SPECIFICATION</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              {size_guide ? '상세 제품 스펙 및 크기 비교' : '상세 제품 스펙'}
            </h3>
          </div>
          <div className={`grid grid-cols-1 gap-gutter ${size_guide ? 'lg:grid-cols-2' : ''}`}>
            <dl className="flex flex-col gap-space-sm">
              {specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-space-md py-3 bg-surface-container-lowest px-4 rounded">
                  <dt className="font-label-md text-label-md text-outline font-bold shrink-0">{spec.label}</dt>
                  <dd className={`font-body-sm text-body-sm font-bold text-right ${spec.highlight ? 'text-primary' : 'text-on-surface'}`}>
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
            {size_guide && (
              <div className="p-space-lg rounded bg-surface-container-lowest flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface">사이즈 선택 가이드</span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">{size_guide.basis}</span>
                </div>
                <div className="flex items-end justify-center gap-space-lg py-space-md">
                  {size_guide.items.map((item) => (
                    <div key={item.size} className="flex flex-col items-center gap-2">
                      <div
                        className={`rounded-full flex items-center justify-center font-label-md text-label-md font-bold ${
                          item.scale === 'lg' ? 'w-28 h-44 bg-primary-fixed/40 text-primary' : 'w-20 h-32 bg-secondary-fixed/40 text-secondary'
                        }`}
                      >
                        {item.size}
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">{item.name}</span>
                      <span className="font-label-sm text-label-sm text-outline">{item.use}</span>
                    </div>
                  ))}
                </div>
                <p className="font-label-sm text-label-sm text-center text-on-surface-variant bg-surface-container-low py-2 px-3 rounded">
                  💡 {size_guide.tip}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
