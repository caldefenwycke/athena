// components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import Header from '../Header';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import ProtectedRoute from '../ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
