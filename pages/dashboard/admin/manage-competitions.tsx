'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logSystemEvent } from '@/lib/logSystemEvent';

interface Competition {
  id: string;
  name?: string;
  location?: string;
  date?: string;
  status?: string;
}

export default function ManageCompetitions() {
  const { user } = useAuth(); // ✅ fixed usage
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'competitions'));
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Competition, 'id'>),
        }));
        setCompetitions(data);
      } catch (err) {
        console.error('Error fetching competitions:', err);
      }
    };

    fetchCompetitions();
  }, []);

  const deleteCompetition = async (compId: string, name?: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${name || 'this competition'}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'competitions', compId));
      setCompetitions((prev) => prev.filter((c) => c.id !== compId));
      alert(`Competition "${name}" deleted successfully.`);

      await logSystemEvent({
        action: 'Competition Deleted',
        performedBy: user.uid,
        performedByEmail: user.email || 'unknown',
        competitionId: compId,
        details: `Deleted competition "${name}"`,
      });
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('Failed to delete competition.');
    }
  };

  const filteredCompetitions = competitions.filter((comp) =>
    comp.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Manage Competitions</h1>

        <input
          type="text"
          placeholder="Search competitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-[#222] text-white border border-[#333]"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#00FF00] border-b border-[#333]">
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitions.map((comp) => (
                <tr key={comp.id} className="border-t border-[#333] hover:bg-[#1c1c1c]">
                  <td className="py-2">{comp.name || 'Untitled Competition'}</td>
                  <td className="py-2">{comp.location || 'N/A'}</td>
                  <td className="py-2">{comp.date || 'No Date Set'}</td>
                  <td className="py-2">{comp.status || 'N/A'}</td>
                  <td className="py-2 flex gap-2">
                    <Link href={`/dashboard/competition/${comp.id}/settings`}>
                      <button className="bg-[#00FF00] text-black text-xs px-3 py-1 rounded hover:bg-[#00e600]">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteCompetition(comp.id, comp.name)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
