// components/layout/DashboardLayout.tsx

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardSidebar from '@/components/ui/sidebars/DashboardSidebar';
import OrganiserSidebar from '@/components/ui/sidebars/OrganiserSidebar';
import ProtectedRoute from '@/components/protected/ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { id: competitionId } = router.query;

  const isCompetitionSettings = router.pathname.includes('/dashboard/organiser/[id]/settings');

  const [activeTab, setActiveTab] = useState('Basic');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingTab, setPendingTab] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-black px-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 bg-[#111] text-white p-4 rounded-xl mr-6 h-fit">
          <DashboardSidebar />
          {isCompetitionSettings && competitionId && (
            <>
              <div className="border-t border-[#333] my-4" />
              <OrganiserSidebar
                competitionId={competitionId as string}
                activeTab={activeTab}
                isDirty={isDirty}
                setPendingTab={setPendingTab}
                setShowModal={setShowModal}
              />
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

