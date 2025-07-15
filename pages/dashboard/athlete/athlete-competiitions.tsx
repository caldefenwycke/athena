'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import Link from 'next/link';

interface EventPerformance {
  event: string;
  weight: number;
  reps: number;
}

interface CompetitionResult {
  id: string;
  name: string;
  date: string;
  totalScore: number;
  placement: number;
  events: EventPerformance[];
}

interface UpcomingCompetition {
  id: string;
  name: string;
  location?: string;
  startDate?: string;
}

const RESULTS_PER_PAGE = 5;

export default function AthleteCompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<CompetitionResult[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingCompetition[]>([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'past' | 'upcoming'>('upcoming');

  useEffect(() => {
    if (!user) return;

    const fetchPastCompetitions = async () => {
      setLoading(true);
      try {
        const competitionsRef = collection(db, 'competitions');
        const competitionsSnap = await getDocs(competitionsRef);
        const athleteResults: CompetitionResult[] = [];

        for (const compDoc of competitionsSnap.docs) {
          const compId = compDoc.id;
          const compData = compDoc.data();

          const regRef = doc(db, 'competitions', compId, 'registrations', user.uid);
          const regSnap = await getDoc(regRef);
          if (!regSnap.exists()) continue;

          const scoreRef = doc(db, 'competitions', compId, 'scores', user.uid);
          const scoreSnap = await getDoc(scoreRef);

          const totalScore = scoreSnap.exists() ? scoreSnap.data().totalScore || 0 : 0;
          const placement = scoreSnap.exists() ? scoreSnap.data().placement || 0 : 0;
          const events: EventPerformance[] = scoreSnap.exists()
            ? scoreSnap.data().events || []
            : [];

          const dateObj = compData.startDate?.toDate?.();
          const formattedDate = dateObj
            ? dateObj.toLocaleDateString('en-GB')
            : 'Unknown Date';

          athleteResults.push({
            id: compId,
            name: compData.name || 'Unnamed Competition',
            date: formattedDate,
            totalScore,
            placement,
            events,
          });
        }

        athleteResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCompetitions(athleteResults);
      } catch (err) {
        console.error('Error fetching past competitions:', err);
      }
      setLoading(false);
    };

    const fetchUpcomingCompetitions = async () => {
      try {
        const competitionsRef = collection(db, 'competitions');
        const competitionsSnap = await getDocs(competitionsRef);
        const tempUpcoming: UpcomingCompetition[] = [];

        for (const compDoc of competitionsSnap.docs) {
          const compId = compDoc.id;
          const compData = compDoc.data();

          const regRef = doc(db, 'competitions', compId, 'registrations', user.uid);
          const regSnap = await getDoc(regRef);
          if (!regSnap.exists()) continue;

          const startDateObj = compData.startDate?.toDate?.();
          if (startDateObj && startDateObj > new Date()) {
            tempUpcoming.push({
              id: compId,
              name: compData.name,
              location: compData.location,
              startDate: startDateObj.toLocaleDateString('en-GB'),
            });
          }
        }

        setUpcoming(tempUpcoming);
      } catch (error) {
        console.error('Error fetching upcoming competitions:', error);
      }
    };

    fetchPastCompetitions();
    fetchUpcomingCompetitions();
  }, [user]);

  const filtered = competitions.filter((comp) =>
    comp.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / RESULTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const averageScore =
    filtered.length > 0
      ? filtered.reduce((acc, comp) => acc + comp.totalScore, 0) / filtered.length
      : 0;

  function getPlacementLabel(place: number): string {
    const suffix = (n: number) =>
      ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] ?? 'th';
    const emoji =
      place === 1
        ? '🥇'
        : place === 2
        ? '🥈'
        : place === 3
        ? '🥉'
        : place <= 10
        ? '🎖️'
        : '🎗️';
    return `${emoji} ${place}${suffix(place)}`;
  }

  const handleUnregister = async (competitionId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'competitions', competitionId, 'registrations', user.uid));
      setUpcoming((prev) => prev.filter((comp) => comp.id !== competitionId));
      alert('You have been unregistered.');
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister.');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Athlete Competitions</h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'upcoming'
                ? 'bg-[#00FF00] text-black'
                : 'bg-[#1A1A1A] text-gray-300'
            }`}
          >
            Upcoming Competitions
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === 'past'
                ? 'bg-[#00FF00] text-black'
                : 'bg-[#1A1A1A] text-gray-300'
            }`}
          >
            Competition Results
          </button>
        </div>

        {/* PAST COMPETITIONS */}
        {activeTab === 'past' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <input
                type="text"
                placeholder="Search competitions..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-1/3 bg-[#222] border border-[#333] px-3 py-2 rounded text-white"
              />

              <div className="text-sm text-[#00FF00] font-semibold">
                Average Score:{' '}
                <span className="text-white font-normal">
                  {averageScore.toFixed(1)}
                </span>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : paginated.length === 0 ? (
              <p className="text-gray-400">No competitions found.</p>
            ) : (
              paginated.map((comp) => (
                <div key={comp.id} className="bg-[#222] p-4 rounded border border-[#333] space-y-3">
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <p className="font-semibold text-lg text-[#00FF00]">{comp.name}</p>
                      <p className="text-sm text-gray-400">{comp.date}</p>
                    </div>
                    <div className="text-right text-sm text-white space-y-1">
                      {new Date(comp.date) > new Date() ? (
                        <div className="text-yellow-400 font-semibold">
                          Competition not yet started
                        </div>
                      ) : comp.totalScore === 0 && comp.placement === 0 ? (
                        <div className="text-gray-400 font-semibold">
                          Awaiting results
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-[#00FF00] font-semibold">Score:</span>{' '}
                            {comp.totalScore}
                          </div>
                          <div>
                            <span className="text-[#00FF00] font-semibold">Placement:</span>{' '}
                            {getPlacementLabel(comp.placement)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm mt-2">
                    <p className="text-[#00FF00] mb-1">Event Breakdown:</p>
                    <ul className="list-disc list-inside text-white space-y-1">
                      {comp.events.map((event, i) => (
                        <li key={i}>
                          {event.event}: {event.weight}kg × {event.reps} reps
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="text-[#00FF00] disabled:text-gray-500"
                >
                  ← Prev
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="text-[#00FF00] disabled:text-gray-500"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* UPCOMING COMPETITIONS */}
        {activeTab === 'upcoming' && (
          <>
            {upcoming.length === 0 ? (
              <p className="text-gray-400">No upcoming competitions found.</p>
            ) : (
              upcoming.map((comp) => (
                <div key={comp.id} className="bg-[#222] p-4 rounded border border-[#333] space-y-2">
                  <p className="text-lg text-[#00FF00] font-semibold">{comp.name}</p>
                  <p className="text-sm text-gray-400">📅 {comp.startDate}</p>
                  {comp.location && (
                    <p className="text-sm text-gray-400">📍 {comp.location}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Link
                      href={`/public-competition/${comp.id}`}
                      className="px-3 py-1 text-sm bg-[#00FF00] text-black rounded hover:bg-[#00e600]"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleUnregister(comp.id)}
                      className="px-3 py-1 text-sm bg-amber-500 text-black rounded hover:bg-amber-600"
                    >
                      Unregister
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
