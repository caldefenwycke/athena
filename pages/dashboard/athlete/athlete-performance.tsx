'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import { Tab } from '@headlessui/react';
import { getAuth } from 'firebase/auth';

interface PersonalStats {
  lifts: string[];
  eventsParticipated: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

interface LeaderboardEntry {
  name: string;
  userId: string;
  bestScore: number;
}

export default function AthletePerformancePage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedTab, setSelectedTab] = useState(0);
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchPersonalStats();
      fetchLeaderboard();
    }
  }, [user?.uid]);

  const fetchPersonalStats = async () => {
    try {
      const statsRef = doc(db, 'users', user!.uid, 'private', 'stats');
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        setPersonalStats(statsSnap.data() as PersonalStats);
      }
    } catch (error) {
      console.error('Error fetching personal stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const entries: LeaderboardEntry[] = [];

      for (const docSnap of snapshot.docs) {
        const userId = docSnap.id;
        const statRef = doc(db, 'users', userId, 'private', 'stats');
        const statSnap = await getDoc(statRef);
        if (statSnap.exists()) {
          const data = statSnap.data() as DocumentData;
          entries.push({
            name: docSnap.data().displayName || 'Unknown',
            userId,
            bestScore: data.bestScore || 0,
          });
        }
      }

      const sorted = entries.sort((a, b) => b.bestScore - a.bestScore);
      setLeaderboard(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Athlete Performance</h1>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-4 border-b border-gray-700 mb-6">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
                  selected ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              Personal Stats
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
                  selected ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              Global Leaderboard
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              {personalStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                  <div className="bg-gray-800 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Events Participated</h2>
                    <p>{personalStats.eventsParticipated}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Medals</h2>
                    <ul>
                      <li>🥇 Gold: {personalStats.medals.gold}</li>
                      <li>🥈 Silver: {personalStats.medals.silver}</li>
                      <li>🥉 Bronze: {personalStats.medals.bronze}</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded shadow col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-2">Favourite Lifts</h2>
                    <ul className="list-disc list-inside">
                      {personalStats.lifts.map((lift, idx) => (
                        <li key={idx}>{lift}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Loading stats...</p>
              )}
            </Tab.Panel>

            <Tab.Panel>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 text-white rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Rank</th>
                      <th className="px-4 py-2 text-left">Athlete</th>
                      <th className="px-4 py-2 text-left">Best Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.userId} className="border-t border-gray-700">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{entry.name}</td>
                        <td className="px-4 py-2">{entry.bestScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
}
