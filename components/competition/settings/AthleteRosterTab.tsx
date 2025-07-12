'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ListOrdered } from 'lucide-react';

interface Athlete {
  id: string;
  fullName: string;
  email: string;
  division?: string;
}

interface AthleteRosterTabProps {
  competitionId: string;
  markDirty: () => void;
}

export default function AthleteRosterTab({ competitionId, markDirty }: AthleteRosterTabProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      if (!competitionId) return;

      try {
        const regRef = collection(db, 'competitions', competitionId, 'registrations');
        const regSnap = await getDocs(regRef);

        const athleteData: Athlete[] = await Promise.all(
          regSnap.docs.map(async (reg) => {
            const athleteId = reg.id;
            const userRef = doc(db, 'users', athleteId);
            const userSnap = await getDoc(userRef);
            const user = userSnap.exists() ? userSnap.data() : {};

            return {
              id: athleteId,
              fullName: user.fullName || 'Unknown',
              email: user.email || 'No email',
              division: reg.data().division || 'Unassigned',
            };
          })
        );

        setAthletes(athleteData);
      } catch (error) {
        console.error('Error fetching roster:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [competitionId]);

  // Future: Trigger markDirty when a division is edited
  const handleEditDivision = (athleteId: string) => {
    markDirty();
    // TODO: Add editable division logic and Firestore update here
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white space-y-6">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2">
        <ListOrdered size={20} className="text-[#00FF00]" />
        Athlete Roster
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading athlete roster...</p>
      ) : athletes.length === 0 ? (
        <p className="text-gray-400">No registered athletes yet.</p>
      ) : (
        <div className="overflow-x-auto bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left border-b border-gray-700 pb-2">Name</th>
                <th className="text-left border-b border-gray-700 pb-2">Email</th>
                <th className="text-left border-b border-gray-700 pb-2">Division</th>
                <th className="text-left border-b border-gray-700 pb-2">Profile</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete) => (
                <tr key={athlete.id}>
                  <td className="py-2">{athlete.fullName}</td>
                  <td className="py-2">{athlete.email}</td>
                  <td className="py-2">
                    {athlete.division}
                    {/* 🔧 Future editable field: */}
                    {/* <input
                      type="text"
                      value={athlete.division}
                      onChange={() => handleEditDivision(athlete.id)}
                    /> */}
                  </td>
                  <td className="py-2">
                    <Link href={`/dashboard/athlete/bio?user=${athlete.id}`}>
                      <span className="text-green-400 hover:underline cursor-pointer">View Bio</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



