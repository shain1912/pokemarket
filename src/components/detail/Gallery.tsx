import { useEffect, useState } from 'react';
import { DETAIL_TRUST_BADGES } from '../../data/site';
import type { ProductFull } from '../../lib/types';
import { Icon } from '../common/Icon';

interface GalleryProps {
  readonly product: ProductFull;
}

export function Gallery({ product }: GalleryProps) {
  const cover = product.detail.main_image ?? product.image_url;
  // null = 대표 이미지, 숫자 = 선택한 썸네일
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => setActive(null), [product.id]);

  const current = active === null ? cover : (product.images[active]?.url ?? cover);

  return (
    <div className="lg:col-span-7 flex flex-col gap-space-md">
      <div className="relative w-full aspect-[4/3] rounded-lg bg-surface-container-low overflow-hidden shadow-sm group">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={current}
          alt={product.name}
        />
        <div className="absolute top-space-md left-space-md flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-sm">
          <span className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest" />
          </span>
          <span className="font-label-sm text-label-sm text-on-surface font-bold">공식 라이선스 인증</span>
        </div>
        {product.detail.type_tag && (
          <div className="absolute bottom-space-md left-space-md flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            <Icon name={product.detail.type_tag.icon} className="text-sm" />
            <span>{product.detail.type_tag.text}</span>
          </div>
        )}
      </div>

      {product.images.length > 0 && (
        <div className="grid grid-cols-4 gap-space-sm">
          {product.images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(active === i ? null : i)}
              className={`group relative aspect-square rounded overflow-hidden p-1 transition-all ${
                active === i ? 'bg-primary-fixed' : 'bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <img className="w-full h-full object-cover rounded" src={image.url} alt={image.label ?? product.name} loading="lazy" />
              {image.label && (
                <span className="absolute inset-x-0 bottom-0 bg-inverse-surface/60 text-inverse-on-surface text-center font-label-sm text-label-sm py-0.5">
                  {image.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-xs p-space-md rounded-lg bg-surface-container-low">
        {DETAIL_TRUST_BADGES.map((badge) => (
          <div key={badge.title} className="flex items-center gap-space-xs">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badge.tone}`}>
              <Icon name={badge.icon} className="text-base" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm font-bold text-on-surface">{badge.title}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{badge.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
