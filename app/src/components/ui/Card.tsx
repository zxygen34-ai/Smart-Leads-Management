import { ReactNode } from 'react';

import { cx } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={cx('panel', className)}>{children}</div>;
}
