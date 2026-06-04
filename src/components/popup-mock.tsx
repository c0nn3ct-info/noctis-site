import { ArrowRight, ExternalLink, Plus, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fab } from '@/components/ui/fab';
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonCaret,
} from '@/components/ui/split-button';
import { LatencyPip } from '@/components/m3/latency-pip';
import { ServerMonogram } from '@/components/m3/server-monogram';
import { cn } from '@/lib/utils';

interface MockServer {
  name: string;
  host: string;
  ms: number;
  active?: boolean;
  enabled?: boolean;
}

const SERVERS: ReadonlyArray<MockServer> = [
  {
    name: '🇳🇱 Amsterdam',
    host: 'ams.example.net:443',
    ms: 23,
    active: true,
    enabled: true,
  },
  {
    name: '🇩🇪 Frankfurt',
    host: 'fra.example.net:443',
    ms: 38,
  },
  {
    name: '🇸🇬 Singapore',
    host: 'sg.example.net:8443',
    ms: 188,
  },
];

export function PopupMock() {
  return (
    <div dir="ltr" className="pointer-events-auto flex min-h-[560px] w-[380px] flex-col rounded-lg border border-outline-variant bg-background text-on-surface shadow-e3">
      <section className="shrink-0 px-4 pb-4 pt-4">
        <Card variant="elevated" padding="md" className="overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="text-label-small uppercase tracking-[0.16em] text-on-surface-variant">
                Tunnel status
              </div>
              <h2 className="text-headline-small font-medium leading-tight tracking-tight">
                You are protected
              </h2>
              <div className="space-y-0.5 text-sm text-on-surface-variant">
                <div className="block truncate">
                  Amsterdam · via <b className="text-on-surface">reality</b>
                </div>
                <div className="block truncate font-mono text-on-surface">203.0.113.47</div>
              </div>
            </div>
            <Fab color="success" size="regular" aria-label="Disconnect" type="button">
              <Power aria-hidden />
            </Fab>
          </div>
        </Card>
      </section>

      <section className="flex flex-col px-2 pb-2 pt-3">
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <span className="text-label-small uppercase text-on-surface-variant">Pinned</span>
          <Button type="button" variant="text" size="xs" aria-label="View all servers">
            View all
            <ArrowRight />
          </Button>
        </div>
        <ul className="space-y-1">
          {SERVERS.map((s) => (
            <PopupServerRow key={s.name} server={s} />
          ))}
        </ul>
      </section>

      <footer className="mt-auto flex shrink-0 items-center gap-2 px-4 py-3">
        <SplitButton variant="filled" size="s">
          <SplitButtonAction type="button">
            <Plus />
            Add
          </SplitButtonAction>
          <SplitButtonCaret type="button" aria-label="More add options" />
        </SplitButton>
        <Button variant="filled-tonal" size="s" type="button" className="flex-1">
          Panel
          <ExternalLink />
        </Button>
      </footer>
    </div>
  );
}

function PopupServerRow({ server }: { server: MockServer }) {
  const isLive = !!server.active && !!server.enabled;
  return (
    <li
      className={cn(
        'group relative flex items-center gap-3 px-3 py-3 transition-colors',
        isLive
          ? 'rounded-xl bg-success-container text-success-on-container shadow-e1'
          : 'rounded-lg',
      )}
    >
      <ServerMonogram
        name={server.name}
        size={isLive ? 'md' : 'sm'}
        shape={isLive ? 'squircle' : 'rounded'}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="w-full truncate text-title-medium leading-tight">{server.name}</span>
        <span className="truncate font-mono text-label-small opacity-75">{server.host}</span>
      </div>
      <LatencyPip ms={server.ms} />
    </li>
  );
}
