import type { ReactNode } from 'react';

import { cx } from '@/lib/utils';

type AlertTone = 'info' | 'danger';

type AlertProps = {
  title: string;
  description?: string;
  tone?: AlertTone;
  action?: ReactNode;
  className?: string;
};

const toneStyles: Record<AlertTone, string> = {
  info: 'border-sky-100 bg-sky-50 text-sky-900',
  danger: 'border-rose-100 bg-rose-50 text-rose-900'
};

export function Alert({ title, description, tone = 'info', action, className }: AlertProps) {
  return (
    <div className={cx('rounded-2xl border px-4 py-3 text-sm', toneStyles[tone], className)}>
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
