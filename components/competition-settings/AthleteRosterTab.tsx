'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface RosterTabProps {
  competitionId: string;
}

type AthleteType = {
  id: string;
  name: string;
  division: string;
  timestamp: string;
  status: 'registered' | 'banned';
};

export default function RosterTab({ competitionId }: RosterTabProps) {
  const { user } = useAuth();
  const [roster, setRoster] = useState<AthleteType[]>([]);
  const [blockedAthletes, setBlockedAthletes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'registered' | 'banned'>('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'division'>('alphabetical');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const compDoc = await getDoc(doc(db, 'competitions', competitionId));
        const blocked = compDoc.exists() ? compDoc.data().blockedAthletes || [] : [];
        setBlockedAthletes(blocked);

        const regSnap = await getDocs(collection(db, 'competitions', competitionId, 'registrations'));

        const athleteDataPromises = regSnap.docs.map(async (docSnap) => {
          const regData = docSnap.data();
          const userRef = doc(db, 'users', docSnap.id);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          const displayName = userSnap.exists()
            ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown Athlete'
            : 'Unknown Athlete';

          return {
            id: docSnap.id,
            name: displayName,
            division: (regData.division || '') as string,
            timestamp: (regData.timestamp || '') as string,
            status: (blocked.includes(docSnap.id) ? 'banned' : 'registered') as 'registered' | 'banned',
          } as AthleteType;
        });

        const fullRoster = await Promise.all(athleteDataPromises);
        setRoster(fullRoster);
      } catch (error) {
        console.error('Error fetching roster:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [competitionId]);

  const handleUnregister = async (athleteId: string) => {
    try {
      await deleteDoc(doc(db, 'competitions', competitionId, 'registrations', athleteId));
      setRoster((prev) => prev.filter((athlete) => athlete.id !== athleteId));
      alert('Athlete unregistered.');
    } catch (error) {
      console.error('Error unregistering athlete:', error);
      alert('Failed to unregister.');
    }
  };

  const handleBan = async (athleteId: string) => {
    try {
      const compRef = doc(db, 'competitions', competitionId);
      await updateDoc(compRef, {
        blockedAthletes: arrayUnion(athleteId),
      });
      setBlockedAthletes((prev) => [...prev, athleteId]);
      setRoster((prev) =>
        prev.map((athlete) =>
          athlete.id === athleteId ? { ...athlete, status: 'banned' } : athlete
        )
      );
      alert('Athlete banned.');
    } catch (error) {
      console.error('Error banning athlete:', error);
      alert('Failed to ban athlete.');
    }
  };

  const handleUnban = async (athleteId: string) => {
    try {
      const compRef = doc(db, 'competitions', competitionId);
      await updateDoc(compRef, {
        blockedAthletes: arrayRemove(athleteId),
      });
      setBlockedAthletes((prev) => prev.filter((id) => id !== athleteId));
      setRoster((prev) =>
        prev.map((athlete) =>
          athlete.id === athleteId ? { ...athlete, status: 'registered' } : athlete
        )
      );
      alert('Athlete unbanned.');
    } catch (error) {
      console.error('Error unbanning athlete:', error);
      alert('Failed to unban athlete.');
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}`;
    } catch {
      return isoString;
    }
  };

  const filteredRoster = roster
    .filter((athlete) => athlete.status === activeTab)
    .filter((athlete) => athlete.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else {
        return a.division.localeCompare(b.division);
      }
    });

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Athlete Roster</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-3 py-1 rounded ${activeTab === 'registered' ? 'bg-[#00FF00] text-black' : 'bg-[#333] text-white'}`}
        >
          Registered
        </button>
        <button
          onClick={() => setActiveTab('banned')}
          className={`px-3 py-1 rounded ${activeTab === 'banned' ? 'bg-[#00FF00] text-black' : 'bg-[#333] text-white'}`}
        >
          Banned
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 px-3 py-2 bg-black border border-gray-700 text-white rounded"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="px-3 py-2 bg-black border border-gray-700 text-white rounded"
        >
          <option value="alphabetical">Sort: Alphabetical</option>
          <option value="division">Sort: Division</option>
        </select>
      </div>

      {/* Roster List */}
      {loading && <p>Loading roster...</p>}

      {!loading && filteredRoster.length === 0 && (
        <p>No athletes found for this filter.</p>
      )}

      {!loading && filteredRoster.length > 0 && (
        <div className="space-y-3">
          {filteredRoster.map((athlete) => (
            <div key={athlete.id} className="flex justify-between items-center bg-[#222] p-3 rounded">
              <div>
                <p className="font-bold">{athlete.name}</p>
                <p className="text-sm text-gray-400">Division: {athlete.division || 'N/A'}</p>
                <p className="text-xs text-gray-500">Registered: {formatDate(athlete.timestamp)}</p>
              </div>

              <div className="flex gap-3">
                {activeTab === 'registered' && (
                  <>
                    <Link
                      href={`/dashboard/athlete/bio?user=${athlete.id}`}
                      className="text-[#00FF00] text-sm hover:underline"
                    >
                      View Bio
                    </Link>

                    <button
                      onClick={() => handleUnregister(athlete.id)}
                      className="text-yellow-400 text-sm hover:underline"
                    >
                      Unregister
                    </button>

                    <button
                      onClick={() => handleBan(athlete.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Ban
                    </button>
                  </>
                )}

                {activeTab === 'banned' && (
                  <button
                    onClick={() => handleUnban(athlete.id)}
                    className="text-green-400 text-sm hover:underline"
                  >
                    Unban
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

