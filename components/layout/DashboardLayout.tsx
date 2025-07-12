import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import CompetitionSettingsSidebar from '@/components/ui/CompetitionSettingsSidebar';
import ProtectedRoute from '@/components/protected/ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const isCompetitionSettings = router.pathname.includes('/dashboard/competition/[id]/settings');

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-black px-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 bg-[#111] text-white p-4 rounded-xl mr-6 h-fit">
          <DashboardSidebar />
          {isCompetitionSettings && (
            <>
              <div className="border-t border-[#333] my-4" />
              <CompetitionSettingsSidebar />
            </>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 text-white">
          <div className="bg-[#111] rounded-xl p-6 shadow-md max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
