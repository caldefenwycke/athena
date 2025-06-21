'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';

export default function ShowTimeSelector() {
  const { user } = useAuth();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      if (!user) return;
      const q = query(collection(db, 'competitions'), where('organiserId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompetitions(data);
    };

    fetchCompetitions();
  }, [user]);

  const handleStart = () => {
    if (!selectedId) {
      alert('Please select a competition.');
      return;
    }
    router.push(`/dashboard/competition/show-time/${selectedId}`);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 ml-6 mt-6">DASHBOARD</h1>

      <div className="max-w-4xl mx-auto bg-[#111111] p-6 rounded-lg border border-[#2a2a2a] text-white">
        <h2 className="text-xl font-bold mb-4">Show Time</h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 p-2 bg-[#000000] border border-[#444] rounded text-white w-full md:w-auto"
          >
            <option value="">-- Select a Competition --</option>
            {competitions.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleStart}
            className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold"
          >
            Start
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
