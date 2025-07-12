'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/components/context/AuthContext';
import NewCompetitionButton from '@/components/dashboard/NewCompetitionButton';

interface Competition {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  location?: string;
  startDate?: Timestamp | string;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetCompetitionId, setTargetCompetitionId] = useState<string | null>(null);

  const confirmDeleteCompetition = async () => {
    if (!targetCompetitionId) return;
    try {
      await deleteDoc(doc(db, 'competitions', targetCompetitionId));
      setCompetitions((prev) => prev.filter((comp) => comp.id !== targetCompetitionId));
      alert('Competition deleted successfully.');
    } catch (err) {
      console.error('Error deleting competition:', err);
      alert('Failed to delete competition.');
    } finally {
      setTargetCompetitionId(null);
      setShowDeleteModal(false);
    }
  };


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
      const aDate =
        a.startDate && typeof (a.startDate as Timestamp).toDate === 'function'
          ? (a.startDate as Timestamp).toDate().getTime()
          : 0;
      const bDate =
        b.startDate && typeof (b.startDate as Timestamp).toDate === 'function'
          ? (b.startDate as Timestamp).toDate().getTime()
          : 0;
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
          <NewCompetitionButton />
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
              const startDate =
                comp.startDate && typeof (comp.startDate as Timestamp).toDate === 'function'
                  ? (comp.startDate as Timestamp).toDate()
                  : null;

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
                          ? typeof (comp.startDate as Timestamp).toDate === 'function'
                            ? (comp.startDate as Timestamp).toDate().toLocaleDateString()
                            : comp.startDate.toString()
                          : 'No Date Set'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Registered: {comp.registrationCount || 0}/{comp.maxAthletes || 'Unlimited'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/public/competitions/${comp.id}`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          View
                        </button>
                      </Link>
                      <Link href={`/dashboard/organiser/${comp.id}`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          Manage
                        </button>
                      </Link>
                      <Link href={`/dashboard/competition/show-time/${comp.id}`}>
                        <button className="bg-[#00FF00] text-black text-sm font-semibold px-3 py-1 rounded hover:bg-[#00e600]">
                          Showtime
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setTargetCompetitionId(comp.id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
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
    
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-[#111] p-6 rounded-lg shadow-lg border border-[#333] max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Delete Competition?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to permanently delete this competition?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCompetition}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

</DashboardLayout>
  );
}




