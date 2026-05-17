import type { ReactNode, SelectHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

import { cx } from '@/lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  icon?: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hideLabel, hint, error, icon, className, children, ...props }, ref) => {
    const id = useId();
    const selectId = props.id ?? id;

    return (
      <label className="flex w-full flex-col gap-2 text-sm">
        {label ? (
          <span className={hideLabel ? 'sr-only' : 'font-medium text-ink'}>{label}</span>
        ) : null}
        <span className="relative flex items-center">
          {icon ? <span className="absolute left-3 text-muted">{icon}</span> : null}
          <select
            ref={ref}
            id={selectId}
            className={cx(
              'w-full appearance-none rounded-xl border border-black/20 bg-white pl-3 pr-10 py-2 text-sm text-ink shadow-sm transition focus:border-accent focus:ring-2 focus:ring-accent/20',
              icon ? 'pl-10' : '',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <span className="pointer-events-none absolute right-3 text-muted">v</span>
        </span>
        {error ? (
          <span className="text-xs text-red-600">{error}</span>
        ) : hint ? (
          <span className="text-xs text-muted">{hint}</span>
        ) : null}
      </label>
    );
  }
);

Select.displayName = 'Select';
