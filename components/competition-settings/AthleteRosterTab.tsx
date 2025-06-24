// components/competition-settings/AthleteRosterTab.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Athlete {
  id: string;
  name: string;
  email: string;
  division: string;
  status: string;
}

interface AthleteRosterTabProps {
  competitionId: string;
}

const AthleteRosterTab: React.FC<AthleteRosterTabProps> = ({ competitionId }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const q = query(
          collection(db, 'registrations'),
          where('competitionId', '==', competitionId)
        );
        const querySnapshot = await getDocs(q);
        const athleteList: Athlete[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Athlete[];
        setAthletes(athleteList);
      } catch (error) {
        console.error('Error fetching athletes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [competitionId]);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Athlete Roster</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#222] text-white">
            <tr>
              <th className="p-2 border border-[#333]">Name</th>
              <th className="p-2 border border-[#333]">Email</th>
              <th className="p-2 border border-[#333]">Division</th>
              <th className="p-2 border border-[#333]">Status</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id} className="text-white hover:bg-[#1c1c1c]">
                <td className="p-2 border border-[#333]">{athlete.name}</td>
                <td className="p-2 border border-[#333]">{athlete.email}</td>
                <td className="p-2 border border-[#333]">{athlete.division}</td>
                <td className="p-2 border border-[#333]">{athlete.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AthleteRosterTab;
