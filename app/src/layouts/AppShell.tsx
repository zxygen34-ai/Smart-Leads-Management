import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen">
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-6 pb-12 pt-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
