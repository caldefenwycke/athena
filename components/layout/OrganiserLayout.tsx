// components/layout/OrganiserLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import OrganiserSidebar from '@/components/ui/sidebars/OrganiserSidebar';
import Header from '@/components/layout/Header';

interface OrganiserLayoutProps {
  children: React.ReactNode;
}

export default function OrganiserLayout({ children }: OrganiserLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const competitionId = router.query.id as string; // ✅ Extract from URL

  useEffect(() => {
    setIsClient(true);
    if (!loading && (!user || user.role !== 'organiser')) {
      router.push('/'); // Redirect if not authorised
    }
  }, [user, loading, router]);

  if (!isClient || loading || !user) {
    return <div className="p-8 text-white">Loading organiser portal...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <OrganiserSidebar
          competitionId={competitionId}
          activeTab=""
          isDirty={false}
          setShowModal={() => {}}
          setPendingTab={() => {}}
        />
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
}

