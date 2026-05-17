import { Download, Filter, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { LeadFormModal } from '@/components/LeadFormModal';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterSelect } from '@/components/ui/FilterSelect';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { NotImplemented } from '@/components/ui/NotImplemented';
import { Pagination } from '@/components/ui/Pagination';
import { Table } from '@/components/ui/Table';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/lib/errors';
import { formatDate } from '@/lib/format';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useLeadsFilters } from '@/hooks/useLeadsFilters';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLead,
  listLeads,
  updateLead,
  type LeadListResponse
} from '@/services/leadsApi';
import type { Lead, LeadInput, LeadSource, LeadStatus } from '@/types/lead';

const statusTone: Record<Lead['status'], 'neutral' | 'success' | 'warning' | 'danger'> = {
  New: 'neutral',
  Contacted: 'warning',
  Qualified: 'success',
  Lost: 'danger'
};

const statusOptions = [
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Lost', value: 'Lost' }
];

const sourceOptions = [
  { label: 'Website', value: 'Website' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Referral', value: 'Referral' }
];

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' }
];

export function LeadsPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    search,
    setSearch,
    status,
    setStatus,
    source,
    setSource,
    sort,
    setSort,
    page,
    setPage,
    filters,
    resetFilters
  } = useLeadsFilters();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteDialog = useConfirmDialog<Lead>();

  const isCreateOpen = searchParams.get('new') === '1';
  const editId = searchParams.get('edit');
  const isModalOpen = isCreateOpen || Boolean(editId);

  const openCreate = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('edit');
    next.set('new', '1');
    setSearchParams(next, { replace: true });
  };

  const openEdit = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    next.set('edit', id);
    setSearchParams(next, { replace: true });
  };

  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    next.delete('edit');
    setSearchParams(next, { replace: true });
  };

  const listQueryKey = ['leads', filters] as const;

  const query = useQuery({
    queryKey: listQueryKey,
    queryFn: () => listLeads(filters),
    placeholderData: (previous) => previous
  });

  const items = query.data?.items ?? [];
  const meta = query.data?.meta ?? {
    page,
    limit: 10,
    total: 0,
    totalPages: 0
  };
  const total = meta.total;
  const start = total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const end = total === 0 ? 0 : Math.min(total, meta.page * meta.limit);

  const qualifiedCount = items.filter((lead) => lead.status === 'Qualified').length;
  const responseTime = '--';

  const editQuery = useQuery({
    queryKey: ['lead', editId],
    queryFn: () => getLead(editId as string),
    enabled: Boolean(editId),
    initialData: () => items.find((lead) => lead.id === editId)
  });

  const createMutation = useMutation({
    mutationFn: createLead,
    onMutate: async (payload: LeadInput) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      const previous = queryClient.getQueryData<LeadListResponse>(listQueryKey);

      if (previous) {
        const optimisticLead: Lead = {
          id: `temp-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        queryClient.setQueryData<LeadListResponse>(listQueryKey, {
          ...previous,
          items: [optimisticLead, ...previous.items],
          meta: {
            ...previous.meta,
            total: previous.meta.total + 1
          }
        });
      }

      return { previous };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }

      pushToast({
        title: 'Create failed',
        description: getErrorMessage(error),
        tone: 'danger'
      });
    },
    onSuccess: (lead) => {
      pushToast({ title: 'Lead created', description: lead.name, tone: 'success' });
      closeModal();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LeadInput }) => updateLead(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      const previous = queryClient.getQueryData<LeadListResponse>(listQueryKey);
      const previousDetail = queryClient.getQueryData<Lead>(['lead', id]);

      if (previous) {
        queryClient.setQueryData<LeadListResponse>(listQueryKey, {
          ...previous,
          items: previous.items.map((lead) =>
            lead.id === id
              ? { ...lead, ...payload, updatedAt: new Date().toISOString() }
              : lead
          )
        });
      }

      if (previousDetail) {
        queryClient.setQueryData<Lead>(['lead', id], {
          ...previousDetail,
          ...payload,
          updatedAt: new Date().toISOString()
        });
      }

      return { previous, previousDetail };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(['lead', context.previousDetail.id], context.previousDetail);
      }

      pushToast({
        title: 'Update failed',
        description: getErrorMessage(error),
        tone: 'danger'
      });
    },
    onSuccess: (lead) => {
      pushToast({ title: 'Lead updated', description: lead.name, tone: 'success' });
      closeModal();
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      const previous = queryClient.getQueryData<LeadListResponse>(listQueryKey);

      if (previous) {
        queryClient.setQueryData<LeadListResponse>(listQueryKey, {
          ...previous,
          items: previous.items.filter((lead) => lead.id !== id),
          meta: {
            ...previous.meta,
            total: Math.max(0, previous.meta.total - 1)
          }
        });
      }

      return { previous };
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }

      pushToast({
        title: 'Delete failed',
        description: getErrorMessage(error),
        tone: 'danger'
      });
    },
    onSuccess: () => {
      pushToast({ title: 'Lead deleted', description: 'Lead removed from the pipeline', tone: 'success' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const handleExport = async () => {
    setExportError(null);
    setIsExporting(true);

    try {
      const blob = await exportLeadsCsv(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'smart-leads.csv';
      link.click();
      URL.revokeObjectURL(url);
      pushToast({ title: 'Export ready', description: 'CSV downloaded', tone: 'success' });
    } catch (error) {
      const message = getErrorMessage(error, 'Export failed');
      setExportError(message);
      pushToast({ title: 'Export failed', description: message, tone: 'danger' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAutoPrioritize = () => {
    pushToast({
      title: 'Auto-prioritize',
      description: 'This automation is coming soon.',
      tone: 'info'
    });
  };

  const handleSubmitLead = async (values: LeadInput) => {
    if (editId) {
      await updateMutation.mutateAsync({ id: editId, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  };

  const handleConfirmDelete = async () => {
    const lead = deleteDialog.payload;

    if (!lead) {
      return;
    }

    setDeletingId(lead.id);

    try {
      await deleteMutation.mutateAsync(lead.id);
      queryClient.removeQueries({ queryKey: ['lead', lead.id] });
    } finally {
      setDeletingId(null);
      deleteDialog.close();
    }
  };

  const modalError = createMutation.isError
    ? getErrorMessage(createMutation.error)
    : updateMutation.isError
      ? getErrorMessage(updateMutation.error)
      : editQuery.isError
        ? getErrorMessage(editQuery.error)
        : null;
  const modalLoading = Boolean(editId) && editQuery.isLoading;
  const modalSubmitting = createMutation.isPending || updateMutation.isPending;
  const modalLead = editQuery.data ?? null;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Active leads"
          value={String(total)}
          delta={total > 0 ? '+12%' : undefined}
          caption="Last 30 days"
        />
        <StatCard
          label="Qualified"
          value={String(qualifiedCount)}
          delta={qualifiedCount > 0 ? '+8%' : undefined}
          caption="High-fit leads"
        />
        <StatCard
          label="Response time"
          value={responseTime}
          caption="Analytics coming soon"
        />
      </section>

      <section className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Leads snapshot</h2>
            <p className="text-sm text-muted">Filter, sort, and export real-time demand.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'admin' ? (
              <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            ) : null}
            <Button variant="subtle" onClick={handleAutoPrioritize}>
              <Sparkles className="h-4 w-4" />
              Auto-prioritize
              <Badge tone="info">Soon</Badge>
            </Button>
          </div>
        </div>

        {exportError ? (
          <Alert
            className="mt-4"
            title="Export failed"
            description={exportError}
            tone="danger"
          />
        ) : null}

        <div className="mt-6 grid items-end gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_0.6fr]">
          <Input
            aria-label="Search leads"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FilterSelect
            label="Status"
            value={status}
            options={statusOptions}
            placeholder="Status"
            onChange={(value) => setStatus(value as LeadStatus | '')}
          />
          <FilterSelect
            label="Source"
            value={source}
            options={sourceOptions}
            placeholder="Source"
            onChange={(value) => setSource(value as LeadSource | '')}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            options={sortOptions}
            placeholder="Sort"
            onChange={(value) => setSort(value as 'latest' | 'oldest')}
          />
          <Button variant="subtle" onClick={resetFilters}>
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <LoadingState />
          ) : query.isError ? (
            <Alert
              title="Failed to load leads"
              description={getErrorMessage(query.error)}
              tone="danger"
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="No leads found"
              description="Try clearing filters or add a new lead to get started."
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={resetFilters}>
                    Clear filters
                  </Button>
                  <Button onClick={openCreate}>New lead</Button>
                </div>
              }
            />
          ) : (
            <Table>
              <thead className="bg-black/5 text-xs uppercase tracking-[0.2em] text-muted">
                <tr>
                  <th className="px-6 py-3">Lead</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {items.map((lead) => (
                  <tr key={lead.id} className="hover:bg-black/5">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-ink">{lead.name}</div>
                      <div className="text-xs text-muted">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(lead.id)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Link
                          className="text-sm font-semibold text-ink underline"
                          to={`/leads/${lead.id}`}
                        >
                          View
                        </Link>
                        {user?.role === 'admin' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDialog.open(lead)}
                            disabled={deleteMutation.isPending && deletingId === lead.id}
                          >
                            <Trash2 className="h-4 w-4" />
                            {deleteMutation.isPending && deletingId === lead.id ? 'Deleting' : 'Delete'}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {items.length > 0 ? (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              Showing {start}-{end} of {total} leads
            </p>
            <Pagination
              current={meta.page}
              totalPages={meta.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <NotImplemented
          title="High-intent leads"
          description="Behavioral insights and hot-lead signals will appear here once the analytics module is online."
          action={
            <Button
              variant="outline"
              onClick={() =>
                pushToast({
                  title: 'High-intent leads',
                  description: 'This panel is on the roadmap.',
                  tone: 'info'
                })
              }
            >
              Notify me
            </Button>
          }
        />
        <NotImplemented
          title="Source velocity"
          description="Channel performance analytics will be unlocked in the upcoming analytics release."
          action={
            <Button
              variant="outline"
              onClick={() =>
                pushToast({
                  title: 'Source velocity',
                  description: 'Channel analytics are coming soon.',
                  tone: 'info'
                })
              }
            >
              Notify me
            </Button>
          }
        />
      </section>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        title="Delete lead"
        description={`Delete ${deleteDialog.payload?.name ?? 'this lead'}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={deleteDialog.close}
      />

      <LeadFormModal
        open={isModalOpen}
        mode={editId ? 'edit' : 'create'}
        initialLead={modalLead}
        isLoading={modalLoading}
        isSubmitting={modalSubmitting}
        error={modalError}
        onClose={closeModal}
        onSubmit={handleSubmitLead}
      />
    </div>
  );
}
