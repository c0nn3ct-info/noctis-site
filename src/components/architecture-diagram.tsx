import type { ComponentType, SVGProps } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Chrome,
  Cpu,
  Globe,
  Network,
} from 'lucide-react';
import { ConnectionVisual } from '@/components/m3/connection-visual';
import { cn } from '@/lib/utils';

export function ArchitectureDiagram() {
  return (
    <div dir="ltr" className="relative flex flex-col gap-3 pt-4 lg:flex-row lg:items-stretch lg:gap-2">
      <Node
        context="Browser"
        icon={Chrome}
        title="Extension"
        subtitle="Servers, rules, profiles"
      />
      <Connector label="native messaging" featured boundary />
      <Node
        context="Your machine"
        icon={Network}
        title="Helper"
        subtitle="Bridges the sandbox"
      />
      <Connector label="spawns" />
      <Node
        context="Your machine"
        icon={Cpu}
        title="sing-box"
        subtitle="Networking engine"
      />
      <Connector label="proxy protocols" />
      <Node
        context="Internet"
        icon={Globe}
        title="Proxy server"
        subtitle="Anywhere on the internet"
        muted
      />
    </div>
  );
}

interface NodeProps {
  context: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  muted?: boolean;
}

function Node({ context, icon: Icon, title, subtitle, muted }: NodeProps) {
  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-col gap-1.5 rounded-lg border bg-surface p-3 lg:flex-1',
        muted
          ? 'border-outline-variant bg-surface-container-low/60'
          : 'border-outline-variant',
      )}
    >
      <span
        className={cn(
          'text-[10px] uppercase tracking-[0.16em]',
          muted ? 'text-on-surface-variant/70' : 'text-on-surface-variant',
        )}
      >
        {context}
      </span>
      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-md',
          muted
            ? 'bg-surface-container-high text-on-surface-variant'
            : 'bg-secondary-container text-secondary-on-container',
        )}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>
      <div
        className={cn(
          'text-title-small leading-tight',
          muted && 'text-on-surface-variant',
        )}
      >
        {title}
      </div>
      <div className="line-clamp-2 text-label-small text-on-surface-variant">{subtitle}</div>
    </div>
  );
}

interface ConnectorProps {
  label: string;
  featured?: boolean;
  boundary?: boolean;
}

function Connector({ label, featured, boundary }: ConnectorProps) {
  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center self-stretch py-1 lg:py-0">
      {boundary && (
        <>
          <span
            aria-hidden
            className="absolute inset-y-2 left-1/2 hidden w-px -translate-x-1/2 border-l border-dashed border-outline lg:block"
          />
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-background px-1 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant lg:block"
          >
            sandbox boundary
          </span>
          <span
            aria-hidden
            className="absolute inset-x-4 top-1/2 block h-px -translate-y-1/2 border-t border-dashed border-outline lg:hidden"
          />
        </>
      )}
      <div className="relative z-[1] flex items-center gap-1">
        {featured && (
          <ConnectionVisual state="connected" size={20} className="shrink-0" />
        )}
        <span
          className={cn(
            'whitespace-nowrap rounded-pill border bg-background px-2 py-0.5 text-label-small',
            featured
              ? 'border-success/40 text-on-surface'
              : 'border-outline-variant text-on-surface-variant',
          )}
        >
          {label}
        </span>
        <ArrowRight
          className="hidden h-3.5 w-3.5 text-on-surface-variant lg:inline-block"
          aria-hidden
        />
        <ArrowDown className="h-3.5 w-3.5 text-on-surface-variant lg:hidden" aria-hidden />
      </div>
    </div>
  );
}
