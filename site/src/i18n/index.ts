import en from './en.json';
import ru from './ru.json';
import es from './es.json';
import zhCN from './zh-CN.json';
import fa from './fa.json';
import ar from './ar.json';

export const LOCALES = ['en', 'ru', 'es', 'zh-CN', 'fa', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: readonly Locale[] = ['fa', 'ar'];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  en,
  ru,
  es,
  'zh-CN': zhCN,
  fa,
  ar,
};

const NON_EN_LOCALES = LOCALES.filter((l): l is Exclude<Locale, 'en'> => l !== 'en');

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string): string {
  const dict = DICTIONARIES[currentLocale];
  const value = dict[key];
  if (value === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key} (${currentLocale})`);
    return key;
  }
  return value;
}

/** Strip a known non-English locale prefix from a path → its base form (`/`, `/install/`, …). */
export function stripLocale(path: string): string {
  for (const l of NON_EN_LOCALES) {
    if (path === `/${l}` || path === `/${l}/`) return '/';
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}

/** Prefix a base (English) path with a locale. English stays at the root. */
export function withLocale(base: string, locale: Locale): string {
  if (locale === 'en') return base;
  if (base === '/') return `/${locale}/`;
  return `/${locale}${base}`;
}

export function localePath(path: string): string {
  return withLocale(path, currentLocale);
}
