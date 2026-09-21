import { Icon } from './Icon';

interface StatusMessageProps {
  readonly icon: string;
  readonly title: string;
  readonly body?: string;
  readonly action?: { label: string; onClick: () => void };
}

/** 빈 목록 · 오류 · 404 안내에 공통으로 쓰는 카드 */
export function StatusMessage({ icon, title, body, action }: StatusMessageProps) {
  return (
    <div className="w-full rounded-lg bg-surface-container-low p-space-xl flex flex-col items-center text-center gap-space-sm">
      <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
        <Icon name={icon} className="text-3xl" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {body && <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">{body}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-space-xs px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:opacity-95 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
