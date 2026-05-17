import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cx } from '@/lib/utils';

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cx(
        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
        active ? 'bg-ink text-white shadow-glow' : 'text-ink/70 hover:bg-black/5',
        className
      )}
      {...props}
    />
  )
);

GhostButton.displayName = 'GhostButton';
