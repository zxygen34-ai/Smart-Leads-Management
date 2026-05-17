import { ReactNode } from 'react';

import { cx } from '@/lib/utils';

type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <div className={cx('overflow-hidden rounded-3xl border border-black/5 bg-white', className)}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
