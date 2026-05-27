import { cn } from '@/lib/utils';

export type ConnState = 'idle' | 'connecting' | 'connected' | 'error';

interface Props {
  state: ConnState;
  size?: number;
  className?: string;
}

const styleByState: Record<
  ConnState,
  { ring: string; core: string; durSec: number; pulse: boolean; breathe: boolean }
> = {
  idle: {
    ring: 'bg-outline/30',
    core: 'bg-surface-container-highest text-on-surface-variant',
    durSec: 0,
    pulse: false,
    breathe: true,
  },
  connecting: {
    ring: 'bg-primary/40',
    core: 'bg-primary-container text-primary-on-container',
    durSec: 1.6,
    pulse: true,
    breathe: false,
  },
  connected: {
    ring: 'bg-success/35',
    core: 'bg-success text-success-foreground',
    durSec: 3.2,
    pulse: true,
    breathe: false,
  },
  error: {
    ring: 'bg-error/40',
    core: 'bg-error-container text-error-on-container',
    durSec: 1.4,
    pulse: true,
    breathe: false,
  },
};

export function ConnectionVisual({ state, size = 188, className }: Props) {
  const s = styleByState[state];
  const coreSize = Math.round(size * 0.7);
  const ringSize = Math.round(size * 0.86);
  const stagger = s.durSec / 3;

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size, ['--pulse-dur' as never]: `${s.durSec}s` }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'absolute rounded-full',
            s.ring,
            s.pulse ? 'animate-pulse-ring' : s.breathe && i === 1 ? 'animate-breathe' : 'opacity-25',
          )}
          style={{
            width: ringSize,
            height: ringSize,
            animationDelay: s.pulse ? `${i * stagger}s` : undefined,
          }}
        />
      ))}
      <span
        className={cn(
          'relative grid place-items-center rounded-full shadow-e2 transition-colors duration-med ease-emph',
          s.core,
        )}
        style={{ width: coreSize, height: coreSize }}
      >
        <PowerGlyph size={Math.round(coreSize * 0.42)} />
      </span>
    </div>
  );
}

function PowerGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v9" />
      <path d="M5.5 7a8.5 8.5 0 1 0 13 0" />
    </svg>
  );
}
