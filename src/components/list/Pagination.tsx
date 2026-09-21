import { formatCount } from '../../lib/format';
import { Icon } from '../common/Icon';

interface PaginationProps {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly onPage: (page: number) => void;
}

const PAGE_BUTTON_CLASS =
  'w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface hover:text-primary hover:bg-surface-container font-label-md text-label-md font-bold flex items-center justify-center shadow-sm transition-all';

/** 현재 페이지 주변으로 최대 5개의 페이지 번호 */
function visiblePages(page: number, pageCount: number): number[] {
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const end = Math.min(pageCount, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  return (
    <div className="mt-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md rounded-lg bg-surface-container-low shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <span className="font-label-md text-label-md text-on-surface-variant">
          전체 <strong className="text-on-surface">{formatCount(total)}개</strong> 중{' '}
          <strong className="text-primary">
            {first} - {last}개
          </strong>{' '}
          표시 중
        </span>
      </div>
      <nav className="flex items-center gap-2" aria-label="페이지">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={isFirst}
          onClick={() => onPage(page - 1)}
          className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary flex items-center justify-center shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="chevron_left" className="text-lg" />
        </button>
        {visiblePages(page, pageCount).map((n) =>
          n === page ? (
            <button
              key={n}
              type="button"
              aria-current="page"
              className="relative w-10 h-10 rounded-full bg-primary text-on-primary font-label-md text-label-md font-extrabold flex items-center justify-center shadow-sm"
            >
              <span>{n}</span>
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-secondary-container" />
            </button>
          ) : (
            <button key={n} type="button" onClick={() => onPage(n)} className={PAGE_BUTTON_CLASS}>
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={isLast}
          onClick={() => onPage(page + 1)}
          className="flex items-center gap-1 px-4 h-10 rounded-full bg-surface-container-lowest text-on-surface hover:text-primary hover:bg-surface-container font-label-md text-label-md font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>다음</span>
          <Icon name="arrow_forward" className="text-sm" />
        </button>
      </nav>
    </div>
  );
}
