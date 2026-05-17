import { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="h-12 w-12 rounded-2xl bg-accent/10" />
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
