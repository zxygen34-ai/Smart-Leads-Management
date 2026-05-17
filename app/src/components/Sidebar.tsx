import { ChartNoAxesCombined, LayoutGrid, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GhostButton } from '@/components/ui/GhostButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cx } from '@/lib/utils';

const navItems = [
  { label: 'Leads', to: '/leads', icon: LayoutGrid },
  { label: 'Signals', to: '/leads?view=signals', icon: ChartNoAxesCombined, comingSoon: true }
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-full min-h-screen flex-col border-r border-black/5 bg-white/85 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Smart</p>
          <h2 className="font-display text-xl font-semibold">Leads</h2>
        </div>
        <span className="rounded-full border border-black/5 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          Pro
        </span>
      </div>

      {user ? (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Operator</p>
          <p className="mt-1 font-semibold text-ink">{user.name}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span>{user.email}</span>
            <Badge tone="info">{user.role}</Badge>
          </div>
        </div>
      ) : null}

      <nav className="mt-10 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <GhostButton
                key={item.label}
                type="button"
                onClick={() =>
                  pushToast({
                    title: 'Signals',
                    description: 'Signals module is coming soon.',
                    tone: 'info'
                  })
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
                <Badge tone="info">Soon</Badge>
              </GhostButton>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-ink text-white shadow-glow'
                    : 'text-ink/70 hover:bg-black/5'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-black/5 bg-white/90 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Weekly pulse</p>
        <div className="mt-3">
          <Badge tone="info">Coming soon</Badge>
        </div>
        <p className="mt-3 text-sm text-muted">
          Analytics pulse cards are under construction.
        </p>
        <Button
          className="mt-4 w-full"
          variant="outline"
          onClick={() =>
            pushToast({
              title: 'Pulse analytics',
              description: 'Weekly insights will be available soon.',
              tone: 'info'
            })
          }
        >
          Notify me
        </Button>
      </div>

      <Button className="mt-6" variant="ghost" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </aside>
  );
}
