import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastTone = 'success' | 'info' | 'danger';

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: { title: string; description?: string; tone?: ToastTone }) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function createToastId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const toneStyles: Record<ToastTone, string> = {
  success: 'border-emerald-200/70 bg-emerald-50 text-emerald-900',
  info: 'border-slate-200/70 bg-white text-slate-900',
  danger: 'border-rose-200/70 bg-rose-50 text-rose-900'
};

type ToastViewportProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-rise rounded-2xl border px-4 py-3 text-sm shadow-lift ${toneStyles[toast.tone]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs opacity-80">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-full px-2 text-xs font-semibold opacity-70 hover:opacity-100"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: { title: string; description?: string; tone?: ToastTone }) => {
      const id = createToastId();
      const entry: Toast = {
        id,
        title: toast.title,
        description: toast.description,
        tone: toast.tone ?? 'info'
      };

      setToasts((current) => [entry, ...current].slice(0, 4));

      if (typeof window !== 'undefined') {
        window.setTimeout(() => removeToast(id), 4200);
      }
    },
    [removeToast]
  );

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
