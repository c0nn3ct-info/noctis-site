import * as amplitude from '@amplitude/unified';

const API_KEY = '79c9d01f039a5629c8e2804d611bf6f8';

let initialized = false;

export function initAmplitude(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  if (navigator.webdriver) return;
  initialized = true;
  amplitude.initAll(API_KEY, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}
