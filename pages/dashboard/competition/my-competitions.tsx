'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface Competition {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  location?: string;
  startDate?: Timestamp;
  maxAthletes?: number;
  status: 'active' | 'past';
  registrationCount?: number;
}

export default function MyCompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'date' | 'registered'>('alphabetical');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!user) return;

    const fetchCompetitions = async () => {
      const q = query(collection(db, 'competitions'), where('organizerId', '==', user.uid));
      const snapshot = await getDocs(q);
      const comps: Competition[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const regSnapshot = await getDocs(collection(db, 'competitions', doc.id, 'registrations'));
        comps.push({
          id: doc.id,
          ...(data as Omit<Competition, 'id' | 'registrationCount'>),
          registrationCount: regSnapshot.size,
        });
      }

      setCompetitions(comps);
    };

    fetchCompetitions();
  }, [user]);

  const filtered = competitions
    .filter((c) => c.status === activeTab)
    .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'alphabetical') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortOrder === 'date') {
      const aDate = a.startDate ? a.startDate.toDate().getTime() : 0;
      const bDate = b.startDate ? b.startDate.toDate().getTime() : 0;
      return aDate - bDate;
    } else if (sortOrder === 'registered') {
      return (b.registrationCount || 0) - (a.registrationCount || 0);
    }
    return 0;
  });

  const visibleComps = sorted.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Competitions</h2>
          <Link href="/dashboard/competition/new-competition">
            <button className="bg-[#00FF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#00e600]">
              + Create New
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'active' ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'past' ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'
            }`}
          >
            Past
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search competitions..."
            className="bg-[#222] text-white px-4 py-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bg-[#222] text-white px-3 py-2 rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="alphabetical">Sort: Alphabetical</option>
            <option value="date">Sort: Date</option>
            <option value="registered">Sort: Number Registered</option>
          </select>
        </div>

        {/* Competition List */}
        <div className="flex flex-col gap-4">
          {visibleComps.length === 0 ? (
            <p className="text-gray-400">No competitions to display.</p>
          ) : (
            visibleComps.map((comp) => {
              const startDate = comp.startDate ? comp.startDate.toDate() : null;
              const isUpcoming =
                startDate &&
                new Date().getTime() < startDate.getTime() &&
                startDate.getTime() - new Date().getTime() < 14 * 24 * 60 * 60 * 1000;

              return (
                <div
                  key={comp.id}
                  className={`bg-[#222] rounded p-4 border ${
                    isUpcoming ? 'border-[#00FF00]' : 'border-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[#00FF00] font-semibold text-lg mb-1">
                        {comp.name || comp.title || 'Untitled Competition'}
                      </h4>
                      <p className="text-white text-sm mb-2">{comp.location || ''}</p>
                      <p className="text-sm text-gray-400">
                        📅{' '}
                        {comp.startDate
                          ? comp.startDate.toDate().toLocaleDateString()
                          : 'No Date Set'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Registered: {comp.registrationCount || 0}/{comp.maxAthletes || 'Unlimited'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* ✅ New View Button */}
                      <Link href={`/public-competition/${comp.id}`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          View
                        </button>
                      </Link>
                      <Link href={`/dashboard/competition/${comp.id}/settings`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          Edit
                        </button>
                      </Link>
                      <Link href={`/dashboard/competition/show-time/${comp.id}`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          Showtime
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < sorted.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="bg-[#00FF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#00e600]"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

