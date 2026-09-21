import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchRanking, type RankingScope } from '../../lib/api';
import { StatusMessage } from '../common/StatusMessage';
import { RankingCard } from '../product/RankingCard';

interface RankingSectionProps {
  readonly initialScope?: RankingScope;
}

const SCOPES: { key: RankingScope; label: string }[] = [
  { key: 'all', label: '종합 랭킹' },
  { key: 'plush', label: '인형 & 바디필로우' },
  { key: 'desk', label: '데스크 굿즈' },
];

export function RankingSection({ initialScope = 'all' }: RankingSectionProps) {
  const [scope, setScope] = useState<RankingScope>(initialScope);
  const { data: products, loading, error, reload } = useAsync(() => fetchRanking(scope), [scope]);

  return (
    <section className="w-full px-margin py-space-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-space-sm mb-space-lg">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">REALTIME TOP</span>
              <span className="font-label-sm text-label-sm text-outline">매시간 트레이너 구매 통계 갱신</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-extrabold tracking-tight">
              실시간 인기 랭킹 베스트
            </h2>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low p-1.5 rounded-full font-label-md text-label-md" role="tablist">
            {SCOPES.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={scope === item.key}
                onClick={() => setScope(item.key)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  scope === item.key
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <StatusMessage icon="cloud_off" title="랭킹을 불러오지 못했어요" body={error} action={{ label: '다시 시도', onClick: reload }} />
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter transition-opacity ${loading ? 'opacity-60' : ''}`}>
            {(products ?? []).map((product, i) => (
              <RankingCard key={product.id} product={product} rank={i + 1} />
            ))}
            {!products &&
              [0, 1, 2, 3].map((i) => <div key={i} className="rounded-lg bg-surface-container-low aspect-[3/5] animate-pulse" />)}
          </div>
        )}
      </div>
    </section>
  );
}
