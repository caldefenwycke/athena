'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import ShowtimeLayout from '../../../../components/layouts/ShowtimeLayout';

export default function ShowTimePage() {
  const router = useRouter();
  const { id } = router.query;
  const [competition, setCompetition] = useState<any>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;
      const docRef = doc(db, 'competitions', id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompetition({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such competition!');
      }
    };

    fetchCompetition();
  }, [id]);

  if (!competition) {
    return (
      <ShowtimeLayout>
        <div className="text-white text-center mt-20">Loading competition data...</div>
      </ShowtimeLayout>
    );
  }

  return (
    <ShowtimeLayout>
      <h1 className="text-3xl font-bold mb-6">{competition.name} – Show Time</h1>

      <div className="bg-[#111111] p-6 rounded-lg border border-[#2a2a2a]">
        <p className="text-gray-400 mb-2">
          Location: {competition.location || 'Unknown'} | Date: {competition.date || 'TBC'}
        </p>

        <div className="bg-[#000000] p-4 rounded border border-[#333]">
          <p>This is where you will run the competition events, input scores, and manage the live leaderboard.</p>
          <p className="mt-2 text-green-500 font-semibold">Next: Event tabs, scoring, and athlete flows.</p>
        </div>
      </div>
    </ShowtimeLayout>
  );
}
