import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import CompetitionPortalSidebar from '@/components/ui/CompetitionPortalSidebar';
import ProtectedRoute from '@/components/protected/ProtectedRoute';

interface Props {
  children: ReactNode;
}

export default function CompetitionPortalLayout({ children }: Props) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1A1A] rounded-lg p-4 h-fit">
          {id && <CompetitionPortalSidebar competitionId={id as string} />}
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
