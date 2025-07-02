'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Competition {
  id: string;
  scoringSystem: string;
  customPoints?: number[];
  events: { name: string }[];
  divisions?: string[];
}

interface ScoreEntry {
  athleteId: string;
  eventIndex: number;
  placing: number;
}

interface Registration {
  athleteId: string;
  division: string;
}

interface AthleteProfile {
  displayName: string;
}

interface LeaderboardProps {
  competition: Competition;
}

export default function Leaderboard({ competition }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [athleteNames, setAthleteNames] = useState<{ [athleteId: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [sortMethod, setSortMethod] = useState<'points' | 'name'>('points');

  useEffect(() => {
    const scoreQuery = query(
      collection(db, 'scores'),
      where('competitionId', '==', competition.id)
    );

    const unsubscribeScores = onSnapshot(scoreQuery, (querySnapshot) => {
      const fetchedScores: ScoreEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedScores.push({
          athleteId: data.athleteId,
          eventIndex: data.eventIndex,
          placing: data.placing,
        });
      });
      setScores(fetchedScores);
    });

    const regQuery = query(
      collection(db, 'registrations'),
      where('competitionId', '==', competition.id)
    );

    const unsubscribeRegs = onSnapshot(regQuery, async (querySnapshot) => {
      const fetchedRegs: Registration[] = [];
      const newAthleteIds = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRegs.push({
          athleteId: data.athleteId,
          division: data.division || 'Unassigned Division',
        });
        newAthleteIds.add(data.athleteId);
      });

      setRegistrations(fetchedRegs);

      // Fetch missing athlete names
      const missingNames = [...newAthleteIds].filter((id) => !athleteNames[id]);
      const nameUpdates: { [athleteId: string]: string } = {};

      await Promise.all(
        missingNames.map(async (athleteId) => {
          const userDoc = await getDoc(doc(db, 'users', athleteId));
          if (userDoc.exists()) {
            nameUpdates[athleteId] = userDoc.data().displayName || athleteId;
          } else {
            nameUpdates[athleteId] = athleteId;
          }
        })
      );

      setAthleteNames((prev) => ({ ...prev, ...nameUpdates }));
    });

    return () => {
      unsubscribeScores();
      unsubscribeRegs();
    };
  }, [competition.id, athleteNames]);

  const calculatePoints = (placing: number): number => {
    if (competition.scoringSystem === 'CustomPoints' && competition.customPoints) {
      return placing <= competition.customPoints.length
        ? competition.customPoints[placing - 1]
        : 0;
    }
    if (competition.scoringSystem === 'AthleteCount') {
      return Math.max(registrations.length - (placing - 1), 0);
    }
    if (competition.scoringSystem === 'Linear10to1') {
      return Math.max(10 - (placing - 1), 0);
    }
    return 0;
  };

  const buildLeaderboardData = () => {
    const athleteMap: {
      [athleteId: string]: {
        division: string;
        eventPoints: number[];
        totalPoints: number;
      };
    } = {};

    registrations.forEach((reg) => {
      athleteMap[reg.athleteId] = {
        division: reg.division,
        eventPoints: Array(competition.events.length).fill(0),
        totalPoints: 0,
      };
    });

    scores.forEach((score) => {
      const points = calculatePoints(score.placing);
      if (athleteMap[score.athleteId]) {
        athleteMap[score.athleteId].eventPoints[score.eventIndex] = points;
        athleteMap[score.athleteId].totalPoints += points;
      }
    });

    let rows = Object.entries(athleteMap).map(([athleteId, data]) => ({
      athleteId,
      athleteName: athleteNames[athleteId] || athleteId,
      division: data.division,
      eventPoints: data.eventPoints,
      totalPoints: data.totalPoints,
    }));

    // Apply search filter
    if (searchQuery.trim() !== '') {
      rows = rows.filter((row) =>
        row.athleteName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply division filter
    if (divisionFilter !== '') {
      rows = rows.filter((row) => row.division === divisionFilter);
    }

    // Apply sorting
    if (sortMethod === 'points') {
      rows.sort((a, b) => b.totalPoints - a.totalPoints);
    } else if (sortMethod === 'name') {
      rows.sort((a, b) => a.athleteName.localeCompare(b.athleteName));
    }

    return rows;
  };

  const leaderboardData = buildLeaderboardData();
  const divisions = Array.from(new Set(registrations.map((r) => r.division)));

  return (
    <div className="p-4 bg-[#1a1a1a] text-white rounded shadow space-y-4">
      <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search athlete..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#222] text-white px-3 py-2 rounded border border-[#333]"
        />
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="bg-[#222] text-white px-3 py-2 rounded border border-[#333]"
        >
          <option value="">All Divisions</option>
          {divisions.map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
        <select
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value as 'points' | 'name')}
          className="bg-[#222] text-white px-3 py-2 rounded border border-[#333]"
        >
          <option value="points">Sort by Total Points (High → Low)</option>
          <option value="name">Sort Alphabetically (A → Z)</option>
        </select>
      </div>

      {/* Leaderboard Table */}
      {divisions.map((division) => {
        const divisionRows = leaderboardData.filter((row) => row.division === division);
        if (divisionRows.length === 0) return null;

        return (
          <div key={division} className="mb-6">
            <h4 className="text-xl font-semibold mb-2 text-[#00FF00]">{division}</h4>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#00FF00] text-black">
                  <th className="p-2 text-left">Athlete</th>
                  {competition.events.map((event, idx) => (
                    <th key={idx} className="p-2 text-left">
                      {event.name}
                    </th>
                  ))}
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {divisionRows.map((row) => (
                  <tr key={row.athleteId} className="border-b border-gray-700 hover:bg-[#222]">
                    <td className="p-2">{row.athleteName}</td>
                    {row.eventPoints.map((points, idx) => (
                      <td key={idx} className="p-2">
                        {points > 0 ? points : '–'}
                      </td>
                    ))}
                    <td className="p-2 font-semibold">{row.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

