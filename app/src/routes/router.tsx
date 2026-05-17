import { createBrowserRouter } from 'react-router-dom';

import { GuestRoute, ProtectedRoute } from '@/components/RouteGuard';
import { AppShell } from '@/layouts/AppShell';
import { AuthShell } from '@/layouts/AuthShell';
import { LeadDetailPage } from '@/pages/LeadDetail';
import { LeadsPage } from '@/pages/Leads';
import { LoginPage } from '@/pages/Login';
import { NotFoundPage } from '@/pages/NotFound';
import { RegisterPage } from '@/pages/Register';
import { SeedAdminPage } from '@/pages/SeedAdmin';

export const router = createBrowserRouter([
  {
    element: (
      <GuestRoute>
        <AuthShell />
      </GuestRoute>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/seed-admin', element: <SeedAdminPage /> }
    ]
  },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LeadsPage /> },
      { path: '/leads', element: <LeadsPage /> },
      { path: '/leads/:id', element: <LeadDetailPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
