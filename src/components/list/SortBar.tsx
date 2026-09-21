import { SORT_TABS } from '../../data/site';
import { formatCount } from '../../lib/format';
import type { SortKey } from '../../lib/types';
import { Icon } from '../common/Icon';

export type ViewMode = 'grid' | 'list';

interface SortBarProps {
  readonly total: number;
  readonly sort: SortKey;
  readonly view: ViewMode;
  readonly onSort: (sort: SortKey) => void;
  readonly onView: (view: ViewMode) => void;
}

const VIEW_MODES: { key: ViewMode; icon: string; title: string }[] = [
  { key: 'grid', icon: 'grid_view', title: '그리드 뷰' },
  { key: 'list', icon: 'view_list', title: '리스트 뷰' },
];

export function SortBar({ total, sort, view, onSort, onView }: SortBarProps) {
  return (
    <div className="rounded-lg bg-surface-container-lowest p-space-sm px-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-sm">
      <div className="flex items-center gap-space-xs self-start sm:self-auto">
        <span className="font-body-md text-body-md text-on-surface font-bold">
          총 <span className="text-primary font-extrabold">{formatCount(total)}</span>개의 귀여운 굿즈
        </span>
        <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
          실시간 재고 연동
        </span>
      </div>
      <div className="flex items-center gap-space-sm w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full text-on-surface-variant font-label-md text-label-md overflow-x-auto no-scrollbar">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={sort === tab.key}
              onClick={() => onSort(tab.key)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                sort === tab.key ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full shrink-0">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode.key}
              type="button"
              title={mode.title}
              aria-label={mode.title}
              aria-pressed={view === mode.key}
              onClick={() => onView(mode.key)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                view === mode.key
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon name={mode.icon} className="text-lg" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
