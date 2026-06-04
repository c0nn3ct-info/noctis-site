import { ChevronDown, HelpCircle } from 'lucide-react';
import { t } from '../i18n';

const FAQ_KEYS = [
  'what',
  'vpn',
  'reality',
  'protocols',
  'safe',
  'platforms',
  'subscription',
  'bypass',
  'webrtc',
  'cost',
] as const;

export function FaqSection() {
  return (
    <section className="scroll-mt-24 space-y-4 pb-12" id="faq">
      <h2 className="flex items-center gap-2 text-headline-small font-medium tracking-tight">
        <HelpCircle className="h-5 w-5 text-on-surface-variant" />
        {t('home.faq.h2')}
      </h2>
      <div className="divide-y divide-outline-variant overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
        {FAQ_KEYS.map((k) => {
          const q = t(`home.faq.${k}.q`);
          const a = t(`home.faq.${k}.a`);
          return (
            <details key={k} className="group">
              <summary className="m3-state-layer flex cursor-pointer list-none items-start gap-3 px-4 py-3 text-title-small text-on-surface marker:hidden">
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant transition-transform duration-short ease-emph group-open:rotate-180" />
                <span className="flex-1">{q}</span>
              </summary>
              <div className="px-4 pb-4 ps-11 text-body-medium text-on-surface-variant">{a}</div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
