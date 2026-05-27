import { cn } from '@/lib/utils';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'squircle';
  active?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { dim: 'h-9 w-9', rounded: 'rounded-md', squircle: 'shape-squircle-sm', text: 'text-[12px]', emoji: 'text-lg' },
  md: { dim: 'h-11 w-11', rounded: 'rounded-md', squircle: 'shape-squircle-md', text: 'text-sm', emoji: 'text-2xl' },
  lg: { dim: 'h-14 w-14', rounded: 'rounded-lg', squircle: 'shape-squircle-lg', text: 'text-base', emoji: 'text-3xl' },
};

export function ServerMonogram({ name, size = 'md', shape = 'rounded', className }: Props) {
  const s = sizeMap[size];
  const emoji = leadingEmoji(name);
  const baseClass = cn(
    'inline-flex shrink-0 items-center justify-center select-none',
    s.dim,
    shape === 'squircle' ? s.squircle : s.rounded,
    'transition-[clip-path,border-radius] duration-med ease-spring-standard',
    className,
  );

  if (emoji) {
    return (
      <span
        className={cn(baseClass, 'bg-surface-container-high', s.emoji)}
        aria-hidden
      >
        {emoji}
      </span>
    );
  }

  const letters = lettersFromName(name);
  const hue = hash(name) % 360;
  return (
    <span
      className={cn(
        baseClass,
        s.text,
        'font-semibold uppercase tracking-tight',
        '[--mono-bg-l:88%] [--mono-fg-l:28%] dark:[--mono-bg-l:24%] dark:[--mono-fg-l:88%]',
      )}
      style={{
        background: `hsl(${hue} 30% var(--mono-bg-l))`,
        color: `hsl(${hue} 60% var(--mono-fg-l))`,
      }}
    >
      {letters}
    </span>
  );
}

const EMOJI_HEAD =
  /^(\p{Regional_Indicator}\p{Regional_Indicator}|\p{Extended_Pictographic}(?:‍\p{Extended_Pictographic})*(?:️)?)/u;

function leadingEmoji(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (typeof Intl !== 'undefined' && typeof (Intl as unknown as { Segmenter?: unknown }).Segmenter === 'function') {
    try {
      const seg = new Intl.Segmenter('und', { granularity: 'grapheme' });
      const first = seg.segment(trimmed)[Symbol.iterator]().next().value as
        | { segment: string }
        | undefined;
      if (first && EMOJI_HEAD.test(first.segment)) return first.segment;
    } catch {
      /* fall through */
    }
  }
  const m = trimmed.match(EMOJI_HEAD);
  return m ? m[0] : null;
}

function lettersFromName(name: string): string {
  const stripped = name.replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}/gu, ' ');
  const cleaned = stripped.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (!cleaned) return '··';
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  const compact = parts[0]!;
  if (compact.length >= 2) return compact.slice(0, 2).toUpperCase();
  return compact[0]!.toUpperCase().padEnd(2, '·');
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
