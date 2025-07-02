'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Competition {
  id: string;
  scoringSystem: string;
  customPoints?: number[];
  events: { name: string }[];
}

interface ScoreEntry {
  athleteId: string;
  eventIndex: number;
  placing: number;
}

interface AthleteRow {
  athleteId: string;
  athleteName: string;
  eventPoints: number[];
  totalPoints: number;
}

interface PublicLeaderboardProps {
  competition: Competition;
}

export default function PublicLeaderboard({ competition }: PublicLeaderboardProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [athleteNames, setAthleteNames] = useState<{ [athleteId: string]: string }>({});
  const [registrations, setRegistrations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch scores
      const scoreQuery = query(
        collection(db, 'scores'),
        where('competitionId', '==', competition.id)
      );
      const scoreSnap = await getDocs(scoreQuery);
      const fetchedScores: ScoreEntry[] = [];
      const athleteIdSet = new Set<string>();

      scoreSnap.forEach((doc) => {
        const data = doc.data();
        fetchedScores.push({
          athleteId: data.athleteId,
          eventIndex: data.eventIndex,
          placing: data.placing,
        });
        athleteIdSet.add(data.athleteId);
      });
      setScores(fetchedScores);

      // Fetch registrations (all athletes who entered)
      const regQuery = query(
        collection(db, 'registrations'),
        where('competitionId', '==', competition.id)
      );
      const regSnap = await getDocs(regQuery);
      const regAthletes: string[] = [];
      regSnap.forEach((doc) => {
        const data = doc.data();
        regAthletes.push(data.athleteId);
        athleteIdSet.add(data.athleteId);
      });
      setRegistrations(regAthletes);

      // Fetch athlete display names
      const nameUpdates: { [athleteId: string]: string } = {};
      await Promise.all(
        Array.from(athleteIdSet).map(async (athleteId) => {
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

    fetchData();
  }, [competition.id]);

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

  const buildRows = (): AthleteRow[] => {
    const athleteMap: { [athleteId: string]: AthleteRow } = {};

    registrations.forEach((athleteId) => {
      athleteMap[athleteId] = {
        athleteId,
        athleteName: athleteNames[athleteId] || athleteId,
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

    const rows = Object.values(athleteMap);
    rows.sort((a, b) => b.totalPoints - a.totalPoints);
    return rows;
  };

  const rows = buildRows();

  return (
    <div className="p-4 bg-black text-white max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
      {rows.length === 0 ? (
        <p>No athlete results yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#00FF00] text-black">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Athlete</th>
              {competition.events.map((event, idx) => (
                <th key={idx} className="p-2 text-left">{event.name}</th>
              ))}
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.athleteId} className="border-b border-gray-700 hover:bg-[#111]">
                <td className="p-2">#{index + 1}</td>
                <td className="p-2">{row.athleteName}</td>
                {row.eventPoints.map((points, idx) => (
                  <td key={idx} className="p-2">{points > 0 ? points : '–'}</td>
                ))}
                <td className="p-2 font-semibold">{row.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
