// components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import Header from '../Header';
import DashboardSidebar from '../DashboardSidebar';
import ProtectedRoute from '../ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
