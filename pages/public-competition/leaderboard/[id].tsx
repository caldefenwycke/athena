'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PublicLeaderboard from '@/components/leaderboard/PublicLeaderboard';

interface CompetitionData {
  id: string;
  name: string;
  events: any[]; // Replace with a proper event interface if available
  scoringSystem: string;
  customPoints?: number[];
}

export default function PublicLeaderboardPage() {
  const router = useRouter();
  const { id } = router.query;

  const [competition, setCompetition] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'competitions', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompetition({
            id: id as string,
            name: data.name || '',
            events: data.events || [],
            scoringSystem: data.scoringSystem || 'AthleteCount',
            customPoints: data.customPoints || [],
          });
        } else {
          console.error('Competition not found');
        }
      } catch (error) {
        console.error('Error fetching competition:', error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchCompetition();
    }
  }, [router.isReady, id]);

  if (loading) {
    return <div className="text-white p-6">Loading leaderboard...</div>;
  }

  if (!competition) {
    return <div className="text-red-500 p-6">Competition not found.</div>;
  }

  return (
    <div className="text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Public Leaderboard: {competition.name}</h1>
      <PublicLeaderboard competition={competition} />
    </div>
  );
}
