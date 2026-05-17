import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cx } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'subtle' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-60 disabled:pointer-events-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  outline: 'border border-black/10 bg-white text-ink hover:bg-black/5',
  ghost: 'bg-transparent text-ink hover:bg-black/5',
  subtle: 'bg-black/5 text-ink hover:bg-black/10',
  danger: 'bg-red-500 text-white hover:bg-red-600'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
