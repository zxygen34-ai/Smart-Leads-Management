import { ArrowUpRight } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function AuthShell() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-16 h-80 w-80 rounded-full bg-accent2/20 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <section className="panel relative overflow-hidden p-10">
          <div className="absolute right-8 top-8 text-sm text-muted">Smart Leads 1.0</div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Convert curiosity into customers
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-balance text-ink md:text-5xl">
            A dashboard crafted for fast-moving sales teams.
          </h1>
          <p className="mt-4 text-base text-muted">
            Build confident pipelines with clean lead signals, lightning-fast filters, and
            effortless exports.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-muted">
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 px-5 py-4">
              <span>Live pipeline health</span>
              <span className="font-semibold text-ink">92%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 px-5 py-4">
              <span>Lead response time</span>
              <span className="font-semibold text-ink">2.4 hrs</span>
            </div>
          </div>
        </section>

        <section className="glass rounded-3xl p-8 shadow-glow">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">
              {isLogin ? 'Welcome back' : 'Create your workspace'}
            </h2>
            <ArrowUpRight className="h-5 w-5 text-muted" />
          </div>
          <p className="mt-2 text-sm text-muted">
            {isLogin
              ? 'Pick up right where you left off.'
              : 'Start with a curated setup in minutes.'}
          </p>
          <div className="mt-6">
            <Outlet />
          </div>
          <div className="mt-6 text-sm text-muted">
            {isLogin ? (
              <span>
                New here?{' '}
                <Link className="font-semibold text-ink underline" to="/register">
                  Create an account
                </Link>
              </span>
            ) : (
              <span>
                Already onboard?{' '}
                <Link className="font-semibold text-ink underline" to="/login">
                  Sign in
                </Link>
              </span>
            )}
            <span className="ml-2">|</span>
            <Link className="ml-2 font-semibold text-ink underline" to="/seed-admin">
              Seed admin
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
