import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h2 className="font-display text-3xl font-semibold">This page took a detour.</h2>
      <p className="max-w-md text-sm text-muted">
        The link may be broken or the page has moved. Jump back to your leads workspace.
      </p>
      <Link to="/">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
