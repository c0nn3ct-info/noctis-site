import { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { getLocale, t, type Locale } from '../i18n';

function pairPath(currentPath: string, currentLocale: Locale, target: Locale): string {
  if (target === currentLocale) return currentPath;
  if (target === 'en') {
    if (currentPath === '/ru/' || currentPath === '/ru') return '/';
    return currentPath.replace(/^\/ru/, '') || '/';
  }
  if (currentPath === '/') return '/ru/';
  return `/ru${currentPath}`;
}

const LOCALES: ReadonlyArray<{ code: Locale; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = getLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hrefFor = (target: Locale) =>
    typeof window === 'undefined'
      ? target === 'en'
        ? '/'
        : '/ru/'
      : pairPath(window.location.pathname, locale, target);

  const onSelect = (target: Locale) => {
    try {
      localStorage.setItem('noctis-locale', target);
    } catch {
      /* ignore */
    }
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <IconButton
        type="button"
        variant="standard"
        size="s"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('nav.lang_switch_aria')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('nav.lang_switch_aria')}
      >
        <Languages />
      </IconButton>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 min-w-[10rem] overflow-hidden rounded-md border border-outline-variant bg-surface-container shadow-e2"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code} role="none">
                <a
                  role="menuitem"
                  href={hrefFor(l.code)}
                  hrefLang={l.code}
                  onClick={() => onSelect(l.code)}
                  className={cn(
                    'm3-state-layer flex items-center gap-2 px-3 py-2 text-sm',
                    active ? 'text-on-surface font-medium' : 'text-on-surface-variant',
                  )}
                  aria-current={active ? 'true' : undefined}
                >
                  <span>{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
