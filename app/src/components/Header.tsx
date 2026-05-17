import { Bell, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewLead = () => {
    navigate('/leads?new=1');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Pipeline</p>
          <h1 className="font-display text-2xl font-semibold">Leads overview</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3 sm:max-w-xl">
          {user ? (
            <div className="hidden items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-2 text-sm sm:flex">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Signed in</p>
                <p className="font-semibold text-ink">{user.name}</p>
              </div>
              <Badge tone="info">{user.role}</Badge>
            </div>
          ) : null}
          <Button variant="subtle" size="md">
            <Bell className="h-4 w-4" />
            Alerts
          </Button>
          <Button size="md" onClick={handleNewLead}>
            <Plus className="h-4 w-4" />
            New lead
          </Button>
        </div>
      </div>
    </header>
  );
}
