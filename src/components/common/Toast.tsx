import { useShop } from '../../context/ShopContext';
import { Icon } from './Icon';

interface ToastProps {
  readonly className?: string;
}

export function Toast({ className = '' }: ToastProps) {
  const { toast } = useShop();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md shadow-xl flex items-center gap-2 pointer-events-none transition-all duration-300 z-[70] max-w-[90vw] ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      <Icon name={toast?.icon ?? 'check_circle'} filled className="text-secondary-fixed text-lg" />
      <span>{toast?.message}</span>
    </div>
  );
}
