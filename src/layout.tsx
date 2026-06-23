import type { ReactNode } from 'react';
import { Download, FileText, Github, Home, ShieldCheck } from 'lucide-react';
import { NoctisLogo } from '@/components/noctis-logo';
import { localePath, t } from './i18n';
import { LanguageSwitcher } from './components/language-switcher';
import { GithubLink } from './components/github-link';

type PageKey = 'home' | 'install' | 'privacy' | 'license';

interface LayoutProps {
  current: PageKey;
  children: ReactNode;
}

export function Layout({ current: _current, children }: LayoutProps) {
  const homeHref = localePath('/');
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-outline-variant bg-surface-container-low/95 px-4 backdrop-blur-md sm:px-6">
        <a
          href={homeHref}
          className="m3-state-layer inline-flex items-center gap-2 rounded-pill px-2 py-1 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={t('nav.home_aria')}
        >
          <NoctisLogo className="h-6 w-6 text-primary" />
          <span className="text-title-medium tracking-tight">Noctis</span>
        </a>
        <div className="ms-auto flex items-center gap-1">
          <GithubLink />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:max-w-5xl">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-8 text-label-medium text-on-surface-variant sm:px-6 lg:max-w-5xl">
        <div className="border-t border-outline-variant pt-6 flex flex-wrap items-start gap-x-12 gap-y-6">
          <div className="text-label-small text-on-surface-variant/70">
            {t('footer.by')}
          </div>
          <div>
            <div className="mb-2 text-label-small uppercase tracking-[0.12em] text-on-surface-variant/70">
              {t('footer.pages')}
            </div>
            <ul className="space-y-1.5">
              <li>
                <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={homeHref}>
                  <Home className="h-3.5 w-3.5" />
                  {t('footer.home')}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={localePath('/install/')}>
                  <Download className="h-3.5 w-3.5" />
                  {t('nav.install')}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={localePath('/privacy/')}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t('nav.privacy')}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={localePath('/license/')}>
                  <FileText className="h-3.5 w-3.5" />
                  {t('nav.license')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 text-label-small uppercase tracking-[0.12em] text-on-surface-variant/70">
              {t('footer.sources')}
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  href="https://github.com/c0nn3ct-info/noctis-site"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Github className="h-3.5 w-3.5" />
                  {t('footer.site')}
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  href="https://github.com/c0nn3ct-info/noctis-host"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Github className="h-3.5 w-3.5" />
                  {t('footer.helper')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
