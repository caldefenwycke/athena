import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Timestamp } from 'firebase/firestore';

interface Competition {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  date?: Timestamp; // coming from Firestore
  status: 'active' | 'past';
}

export default function MyCompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  useEffect(() => {
    if (!user) return;

    const fetchCompetitions = async () => {
      const q = query(
        collection(db, 'competitions'),
        where('organizerId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      const comps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Competition, 'id'>),
      }));
      setCompetitions(comps);
    };

    fetchCompetitions();
  }, [user]);

  const filtered = competitions.filter((c) => c.status === activeTab);

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        {/* Title and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Competitions</h2>
          <Link href="/dashboard/competition/new-competition">
            <button className="bg-[#00FF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#00e600]">
              + Create New
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'active'
                ? 'bg-[#00FF00] text-black'
                : 'bg-[#222] text-white hover:bg-[#333]'
            }`}
          >
            Active Competitions
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'past'
                ? 'bg-[#00FF00] text-black'
                : 'bg-[#222] text-white hover:bg-[#333]'
            }`}
          >
            Past Competitions
          </button>
        </div>

        {/* Subheading */}
        <h3 className="text-xl font-bold text-white mb-4">
          {activeTab === 'active' ? 'Active Competitions' : 'Past Competitions'}
        </h3>

        {/* Competition Cards */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p className="text-gray-400">No competitions to display.</p>
          ) : (
            filtered.map((comp) => (
              <div key={comp.id} className="bg-[#222] rounded p-4 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[#00FF00] font-semibold text-lg mb-1">
                      {comp.name || comp.title || 'Untitled Competition'}
                    </h4>
                    <p className="text-white text-sm mb-2">
                      {comp.description || ''}
                    </p>
                    <p className="text-sm text-gray-400">
                      📅 {comp.date ? comp.date.toDate().toLocaleDateString() : 'No Date Set'}
                    </p>
                  </div>
                  <Link href={`/dashboard/competition/${comp.id}/settings`}>
                    <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
