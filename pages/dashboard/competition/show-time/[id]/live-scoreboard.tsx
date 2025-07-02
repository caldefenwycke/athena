'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { db } from '@/lib/firebase';

export default function LiveScoreboard() {
  const router = useRouter();
  const { id } = router.query;
  const [competition, setCompetition] = useState<any | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const docRef = doc(db, 'competitions', id as string);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error('Competition not found');
          setCompetition(null);
          setLoading(false);
          return;
        }

        const compData = docSnap.data();

        // Fetch Events
        const eventsSnap = await getDocs(collection(docRef, 'events'));
        const events = eventsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Fetch Registrations
        const regsSnap = await getDocs(collection(docRef, 'registrations'));
        const regs = regsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setCompetition({
          id: docSnap.id,
          ...compData,
          events,
        });
        setRegistrations(regs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) fetchData();
  }, [id, router.isReady]);

  if (loading) return <p className="text-white p-6">Loading Live Scoreboard...</p>;
  if (!competition) return <p className="text-red-400 p-6">Competition not found.</p>;

  return (
    <DashboardLayout>
      <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Live Scoreboard</h2>
        <Leaderboard competition={competition} registrations={registrations} />
      </div>
    </DashboardLayout>
  );
}






