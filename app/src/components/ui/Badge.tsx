import { cx } from '@/lib/utils';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  tone?: BadgeTone;
  children: string;
};

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-black/5 text-ink',
  success: 'bg-emerald-100 text-emerald-900',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-rose-100 text-rose-900',
  info: 'bg-sky-100 text-sky-900'
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className={cx('inline-flex rounded-full px-3 py-1 text-xs font-semibold', toneStyles[tone])}>
      {children}
    </span>
  );
}
