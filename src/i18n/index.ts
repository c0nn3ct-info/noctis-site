import en from './en.json';
import ru from './ru.json';

export type Locale = 'en' | 'ru';

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, ru };

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

export function localePath(path: string): string {
  if (currentLocale === 'en') return path;
  if (path === '/') return '/ru/';
  return `/ru${path}`;
}

export function alternateLocalePath(path: string): string {
  if (currentLocale === 'ru') {
    if (path === '/ru/' || path === '/ru') return '/';
    return path.replace(/^\/ru/, '');
  }
  if (path === '/') return '/ru/';
  return `/ru${path}`;
}
