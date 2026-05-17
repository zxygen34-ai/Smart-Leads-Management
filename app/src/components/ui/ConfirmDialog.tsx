import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  footerNote?: ReactNode;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading,
  onConfirm,
  onCancel,
  footerNote
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const content = (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-lift animate-rise"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
        {footerNote ? <div className="mt-3 text-xs text-muted">{footerNote}</div> : null}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Working...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
