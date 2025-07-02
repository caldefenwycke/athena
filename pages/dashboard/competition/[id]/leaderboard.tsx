'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Leaderboard from '@/components/leaderboard/Leaderboard';


interface CompetitionData {
  id: string;
  scoringSystem: string;
  customPoints?: number[];
}

export default function LeaderboardPage() {
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
  }, [id, router.isReady]);

  if (loading) return <p className="text-white p-6">Loading leaderboard...</p>;

  if (!competition) return <p className="text-red-400 p-6">Competition not found.</p>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <Leaderboard competition={competition} />
    </div>
  );
}
