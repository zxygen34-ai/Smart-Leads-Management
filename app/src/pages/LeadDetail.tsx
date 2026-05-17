import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/lib/errors';
import { formatDate } from '@/lib/format';
import { deleteLead, getLead } from '@/services/leadsApi';
import type { Lead } from '@/types/lead';

const statusTone: Record<Lead['status'], 'neutral' | 'success' | 'warning' | 'danger'> = {
  New: 'neutral',
  Contacted: 'warning',
  Qualified: 'success',
  Lost: 'danger'
};

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { pushToast } = useToast();

  const detailQuery = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id as string),
    enabled: Boolean(id)
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(id as string)
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!id) {
    return <Alert title="Lead not found" description="Missing lead id." tone="danger" />;
  }

  if (detailQuery.isLoading) {
    return <LoadingState />;
  }

  if (detailQuery.isError) {
    return (
      <Alert
        title="Unable to load lead"
        description={getErrorMessage(detailQuery.error)}
        tone="danger"
      />
    );
  }

  const lead = detailQuery.data as Lead;
  const leadName = lead?.name ?? 'Lead';

  const handleEdit = () => {
    navigate(`/leads?edit=${lead.id}`);
  };

  const handleConfirmDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      pushToast({ title: 'Lead deleted', description: leadName, tone: 'success' });
      navigate('/leads');
    } catch (error) {
      pushToast({
        title: 'Delete failed',
        description: getErrorMessage(error),
        tone: 'danger'
      });
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-ink" to="/leads">
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Lead profile</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{lead.name}</h2>
            <p className="mt-2 text-sm text-muted">{lead.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
            <Button variant="outline" onClick={handleEdit}>
              Edit lead
            </Button>
            {user?.role === 'admin' ? (
              <Button variant="danger" onClick={() => setConfirmOpen(true)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Contact details</h3>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              Email: <span className="font-semibold text-ink">{lead.email}</span>
            </p>
            <p>
              Source: <span className="font-semibold text-ink">{lead.source}</span>
            </p>
            <p>
              Created: <span className="font-semibold text-ink">{formatDate(lead.createdAt)}</span>
            </p>
            <p>
              Updated: <span className="font-semibold text-ink">{formatDate(lead.updatedAt)}</span>
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Latest activity</h3>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>Opened pricing page</p>
            <p>Scheduled a demo for next week</p>
            <p>Sales follow-up queued</p>
          </div>
        </Card>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete lead"
        description={`Delete ${leadName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
