import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { Select } from '@/components/ui/Select';
import type { Lead, LeadInput } from '@/types/lead';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral'])
});

type LeadFormValues = z.infer<typeof leadSchema>;

type LeadFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialLead?: Lead | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: LeadInput) => Promise<void> | void;
};

const defaultValues: LeadFormValues = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website'
};

function ModalFrame({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift animate-rise">
        {children}
      </div>
    </div>
  );
}

export function LeadFormModal({
  open,
  mode,
  initialLead,
  isLoading,
  isSubmitting,
  error,
  onClose,
  onSubmit
}: LeadFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialLead) {
      reset({
        name: initialLead.name,
        email: initialLead.email,
        status: initialLead.status,
        source: initialLead.source
      });
    } else {
      reset(defaultValues);
    }

    clearErrors();
  }, [open, initialLead, reset, clearErrors]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const message = error.toLowerCase();

    if (message.includes('email')) {
      setError('email', { type: 'server', message: error });
    }
  }, [error, setError]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const title = mode === 'create' ? 'Create new lead' : 'Edit lead';
  const subtitle =
    mode === 'create'
      ? 'Add a new lead to the pipeline with core contact details.'
      : 'Update contact info, status, and source for this lead.';

  const formContent = (
    <ModalFrame onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {error ? (
        <Alert className="mt-4" title="Something went wrong" description={error} tone="danger" />
      ) : null}

      <div className="mt-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(async (values) => {
              await onSubmit(values);
            })}
          >
            <Input
              label="Full name"
              placeholder="Riya Sharma"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register('name')}
            />
            <Input
              label="Email"
              placeholder="you@company.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Status"
                error={errors.status?.message}
                disabled={isSubmitting}
                {...register('status')}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </Select>
              <Select
                label="Source"
                error={errors.source?.message}
                disabled={isSubmitting}
                {...register('source')}
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </Select>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create lead' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ModalFrame>
  );

  return createPortal(formContent, document.body);
}
