import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@/styles/globals.css';
import { applyTheme, watchSystemTheme } from '@/lib/theme';
import { initAmplitude } from '@/lib/analytics';

export function mountPage(page: ReactNode): void {
  applyTheme('system');
  watchSystemTheme('system');
  initAmplitude();

  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root');
  const tree = <StrictMode>{page}</StrictMode>;
  if (root.hasChildNodes()) {
    hydrateRoot(root, tree);
  } else {
    createRoot(root).render(tree);
  }
}
