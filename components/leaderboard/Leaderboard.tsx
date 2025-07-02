'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardProps {
  competition: any;
  registrations: any[];
}

export default function Leaderboard({ competition, registrations }: LeaderboardProps) {
  const [athleteNames, setAthleteNames] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [sortBy, setSortBy] = useState('pointsDesc');

  useEffect(() => {
    const fetchAthleteNames = async () => {
      const uniqueAthleteIds = [...new Set(registrations.map((reg) => reg.athleteId).filter(Boolean))];

      const nameUpdates: { [key: string]: string } = {};

      await Promise.all(
        uniqueAthleteIds.map(async (athleteId) => {
          const userDoc = await getDoc(doc(db, 'users', athleteId));
          if (userDoc.exists()) {
            nameUpdates[athleteId] = userDoc.data().displayName || athleteId;
          } else {
            nameUpdates[athleteId] = athleteId;
          }
        })
      );

      setAthleteNames(nameUpdates);
    };

    if (registrations.length > 0) {
      fetchAthleteNames();
    }
  }, [registrations]);

  const filteredRegs = registrations
    .filter((reg) => {
      const matchesDivision = selectedDivision === 'All' || reg.division === selectedDivision;
      const matchesSearch =
        (athleteNames[reg.athleteId]?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (reg.athleteId ? reg.athleteId.toLowerCase().includes(searchQuery.toLowerCase()) : false);
      return matchesDivision && matchesSearch;
    })
    .map((reg) => {
      let totalPoints = 0;
      competition.events?.forEach((event: any) => {
        if (reg[event.id] !== undefined) {
          totalPoints += Number(reg[event.id]) || 0;
        }
      });
      return { ...reg, totalPoints };
    })
    .sort((a, b) => {
      if (sortBy === 'pointsDesc') return b.totalPoints - a.totalPoints;
      if (sortBy === 'pointsAsc') return a.totalPoints - b.totalPoints;
      if (sortBy === 'nameAsc') return (athleteNames[a.athleteId] || '').localeCompare(athleteNames[b.athleteId] || '');
      if (sortBy === 'nameDesc') return (athleteNames[b.athleteId] || '').localeCompare(athleteNames[a.athleteId] || '');
      return 0;
    });

  const uniqueDivisions = ['All', ...Array.from(new Set(registrations.map((r) => r.division).filter(Boolean)))];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search athlete..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded text-black"
        />

        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="p-2 rounded text-black"
        >
          {uniqueDivisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded text-black"
        >
          <option value="pointsDesc">Sort: Points (High → Low)</option>
          <option value="pointsAsc">Sort: Points (Low → High)</option>
          <option value="nameAsc">Sort: Name (A → Z)</option>
          <option value="nameDesc">Sort: Name (Z → A)</option>
        </select>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2 px-2">Rank</th>
            <th className="py-2 px-2">Athlete</th>
            <th className="py-2 px-2">Division</th>
            {competition.events?.map((event: any) => (
              <th key={event.id} className="py-2 px-2">
                {event.name}
              </th>
            ))}
            <th className="py-2 px-2">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredRegs.length > 0 ? (
            filteredRegs.map((reg, index) => (
              <tr key={reg.athleteId} className="border-b border-gray-700">
                <td className="py-1 px-2">{index + 1}</td>
                <td className="py-1 px-2">{athleteNames[reg.athleteId] || reg.athleteId}</td>
                <td className="py-1 px-2">{reg.division}</td>
                {competition.events?.map((event: any) => (
                  <td key={event.id} className="py-1 px-2">
                    {reg[event.id] ?? '-'}
                  </td>
                ))}
                <td className="py-1 px-2">{reg.totalPoints}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3 + (competition.events?.length || 0)} className="py-2 px-2 text-center">
                No athletes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}








