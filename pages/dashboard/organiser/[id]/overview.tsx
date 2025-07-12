'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import OverviewTab from '@/components/competition/settings/OverviewTab';

const OverviewPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;
      try {
        const compRef = doc(db, 'competitions', id as string);
        const compSnap = await getDoc(compRef);
        if (compSnap.exists()) {
          setCompetition({ id: compSnap.id, ...compSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching competition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!competition) return <div className="text-white p-4">Competition not found.</div>;

  return (
    <CompetitionPortalLayout activeTab="Overview">
      <OverviewTab competition={competition} />
    </CompetitionPortalLayout>
  );
};

export default OverviewPage;





