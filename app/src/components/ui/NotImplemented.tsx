import { ReactNode } from 'react';

import { Badge } from '@/components/ui/Badge';

type NotImplementedProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function NotImplemented({ title, description, action }: NotImplementedProps) {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 px-6 py-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <Badge tone="info">Coming soon</Badge>
      </div>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
