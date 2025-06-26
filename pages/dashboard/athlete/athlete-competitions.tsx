import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

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

const RESULTS_PER_PAGE = 5;

export default function AthleteCompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<CompetitionResult[]>([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const competitionsRef = collection(db, 'competitions');
        const competitionsSnap = await getDocs(competitionsRef);
        const athleteResults: CompetitionResult[] = [];

        for (const compDoc of competitionsSnap.docs) {
          const compId = compDoc.id;
          const compData = compDoc.data();

          // Check if athlete registered
          const regRef = doc(db, 'competitions', compId, 'registrations', user.uid);
          const regSnap = await getDoc(regRef);
          if (!regSnap.exists()) continue;

          // Fetch score data for athlete
          const scoreRef = doc(db, 'competitions', compId, 'scores', user.uid);
          const scoreSnap = await getDoc(scoreRef);

          const totalScore = scoreSnap.exists() ? scoreSnap.data().totalScore || 0 : 0;
          const placement = scoreSnap.exists() ? scoreSnap.data().placement || 0 : 0;
          const events: EventPerformance[] = scoreSnap.exists() ? (scoreSnap.data().events || []) : [];

          athleteResults.push({
            id: compId,
            name: compData.name || 'Unnamed Competition',
            date: compData.date || 'Unknown Date',
            totalScore,
            placement,
            events,
          });
        }

        // Sort by date (optional: latest first)
        athleteResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCompetitions(athleteResults);
      } catch (err) {
        console.error('Error fetching competitions:', err);
      }
      setLoading(false);
    };

    fetchCompetitions();
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

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Athlete Competitions</h2>

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
                  <div>
                    <span className="text-[#00FF00] font-semibold">Score:</span>{' '}
                    {comp.totalScore}
                  </div>
                  <div>
                    <span className="text-[#00FF00] font-semibold">Placement:</span>{' '}
                    {getPlacementLabel(comp.placement)}
                  </div>
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
      </div>
    </DashboardLayout>
  );
}
