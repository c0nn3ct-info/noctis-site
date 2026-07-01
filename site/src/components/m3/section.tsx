import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  header: string;
  icon: LucideIcon;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ header, icon: Icon, count, action, children }: Props) {
  return (
    <section className="overflow-hidden rounded-xl bg-surface-container-low">
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary-on-container">
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h3 className="truncate text-title-medium tracking-tight">{header}</h3>
          {typeof count === 'number' && (
            <span className="inline-flex items-center rounded-pill bg-surface-container-highest px-2 py-0.5 text-label-medium text-on-surface-variant">
              {count}
            </span>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="space-y-1 px-2 pb-2 pt-1">{children}</div>
    </section>
  );
}

interface SectionLinkProps {
  title: string;
  icon: LucideIcon;
  supporting?: string;
  onClick: () => void;
  className?: string;
}

export function SectionLink({ title, icon: Icon, supporting, onClick, className }: SectionLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'm3-state-layer flex w-full items-center gap-3 overflow-hidden rounded-xl bg-surface-container-low px-4 py-4 text-start transition-colors duration-short ease-emph',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        className,
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-container text-secondary-on-container">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-title-medium tracking-tight">{title}</span>
        {supporting && (
          <span className="truncate text-label-small text-on-surface-variant">{supporting}</span>
        )}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-on-surface-variant rtl:-scale-x-100" />
    </button>
  );
}
