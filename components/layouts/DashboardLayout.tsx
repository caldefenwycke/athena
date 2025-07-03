// components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import CompetitionSettingsSidebar from '@/components/ui/CompetitionSettingsSidebar'; // New component
import ProtectedRoute from '@/components/protected/ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const isCompetitionSettings = router.pathname.includes('/dashboard/competition/[id]/settings');

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar stack (Main + Optional Competition Settings) */}
        <aside className="w-64 bg-[#1A1A1A] rounded-lg p-4 h-fit">
          <DashboardSidebar />
          {isCompetitionSettings && (
            <>
              <div className="border-t border-[#333] my-4" />
              <CompetitionSettingsSidebar />
            </>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-6">DASHBOARD</h1>
          <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
