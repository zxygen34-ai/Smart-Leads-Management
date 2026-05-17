import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

import { cx } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, className, ...props }, ref) => {
    const id = useId();
    const inputId = props.id ?? id;

    return (
      <label className="flex w-full flex-col gap-2 text-sm">
        {label ? <span className="font-medium text-ink">{label}</span> : null}
        <span className="relative flex items-center">
          {leftIcon ? (
            <span className="absolute left-3 text-muted">{leftIcon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={cx(
              'w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-ink shadow-sm transition focus:border-accent focus:ring-2 focus:ring-accent/20',
              leftIcon ? 'pl-10' : '',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
              className
            )}
            {...props}
          />
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

Input.displayName = 'Input';
