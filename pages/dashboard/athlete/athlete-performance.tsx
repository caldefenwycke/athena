import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';

interface AthleteStat {
  uid: string;
  name: string;
  totalScore: number;
  competitions: number;
  rank: number;
  division: string;
  podiums: { gold: number; silver: number; bronze: number };
}

export default function AthletePerformancePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'global'>('personal');
  const [leaderboard, setLeaderboard] = useState<AthleteStat[]>([]);
  const [personalStats, setPersonalStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteStat | null>(null);
  const [modalTab, setModalTab] = useState<'lifts' | 'events' | 'medals'>('lifts');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    fetchLeaderboardAndPersonal();
  }, [user]);

  const fetchLeaderboardAndPersonal = async () => {
    try {
      const competitionsSnap = await getDocs(collection(db, 'competitions'));
      const allAthleteData: Record<string, AthleteStat> = {};
      let myTotalScore = 0;
      let myCompetitions = 0;
      let myBestPlacement = Infinity;
      let gold = 0, silver = 0, bronze = 0;

      for (const compDoc of competitionsSnap.docs) {
        const compId = compDoc.id;
        const scoresSnap = await getDocs(collection(db, 'competitions', compId, 'scores'));

        for (const scoreDoc of scoresSnap.docs) {
          const athleteId = scoreDoc.id;
          const data = scoreDoc.data();
          const totalScore = data.totalScore || 0;
          const placement = data.placement || 999;
          const athleteRef = doc(db, 'users', athleteId);
          const athleteSnap = await getDoc(athleteRef);
          const athleteName = athleteSnap.exists() ? `${athleteSnap.data().firstName} ${athleteSnap.data().lastName}` : 'Unknown Athlete';
          const division = athleteSnap.exists() ? (athleteSnap.data().division || 'Unknown') : 'Unknown';

          // Global leaderboard aggregation
          if (!allAthleteData[athleteId]) {
            allAthleteData[athleteId] = {
              uid: athleteId,
              name: athleteName,
              totalScore: 0,
              competitions: 0,
              rank: 0,
              division,
              podiums: { gold: 0, silver: 0, bronze: 0 },
            };
          }

          allAthleteData[athleteId].totalScore += totalScore;
          allAthleteData[athleteId].competitions += 1;
          if (placement === 1) allAthleteData[athleteId].podiums.gold += 1;
          if (placement === 2) allAthleteData[athleteId].podiums.silver += 1;
          if (placement === 3) allAthleteData[athleteId].podiums.bronze += 1;

          // Personal stats aggregation
          if (athleteId === user.uid) {
            myTotalScore += totalScore;
            myCompetitions += 1;
            if (placement < myBestPlacement) myBestPlacement = placement;
            if (placement === 1) gold++;
            if (placement === 2) silver++;
            if (placement === 3) bronze++;
          }
        }
      }

      // Rank athletes by totalScore
      const sorted = Object.values(allAthleteData).sort((a, b) => b.totalScore - a.totalScore);
      sorted.forEach((athlete, idx) => (athlete.rank = idx + 1));

      setLeaderboard(sorted);

      setPersonalStats({
        competitions: myCompetitions,
        averageScore: myCompetitions > 0 ? (myTotalScore / myCompetitions).toFixed(1) : 0,
        bestPlacement: myBestPlacement !== Infinity ? myBestPlacement : 'N/A',
        podiums: { gold, silver, bronze },
      });
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
    }
  };

  const filteredLeaderboard = leaderboard.filter(
    (athlete) =>
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (divisionFilter === '' || athlete.division === divisionFilter)
  );

  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaderboard = filteredLeaderboard.slice(startIndex, startIndex + itemsPerPage);

const placementLabel = (place: number | string) => {
  if (place === 1) return '🥇 1st Place';
  if (place === 2) return '🥈 2nd Place';
  if (place === 3) return '🥉 3rd Place';
  if (typeof place !== 'number') return place; // Fix for N/A
  return `${place}th Place`;
};

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Athlete Performance</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded font-semibold ${activeTab === 'personal' ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'}`}
          >
            Personal Stats
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded font-semibold ${activeTab === 'global' ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'}`}
          >
            Global Leaderboard
          </button>
        </div>

        {activeTab === 'personal' && personalStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Total Competitions</p>
              <p className="text-xl font-bold">{personalStats.competitions}</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-xl font-bold">{personalStats.averageScore}</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Best Ranking</p>
              <p className="text-xl font-bold">{placementLabel(personalStats.bestPlacement)}</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Podium Finishes</p>
              <p className="text-xl font-bold">
                🥇 {personalStats.podiums.gold} | 🥈 {personalStats.podiums.silver} | 🥉 {personalStats.podiums.bronze}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'global' && (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white w-full"
              />
            </div>

            <div className="mb-4">
              <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white">
                <option value="">All Divisions</option>
                <option value="U90kg">U90kg</option>
                <option value="U75kg">U75kg</option>
                <option value="Open">Open</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#00FF00]">
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Division</th>
                    <th>Total Score</th>
                    <th>Competitions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeaderboard.map((athlete) => (
                    <tr key={athlete.uid} className="border-t border-[#333] text-white">
                      <td>{athlete.rank <= 3 ? ['🥇', '🥈', '🥉'][athlete.rank - 1] : `🏅 ${athlete.rank}`}</td>
                      <td>{athlete.name}</td>
                      <td>{athlete.division}</td>
                      <td>{athlete.totalScore}</td>
                      <td>{athlete.competitions}</td>
                      <td>
                        <button
                          className="text-[#00FF00] hover:underline"
                          onClick={() => {
                            setSelectedAthlete(athlete);
                            setModalTab('lifts');
                          }}
                        >
                          View Stats
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-white">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
            </div>
          </>
        )}
      </div>

      {/* Athlete Modal (Keep your existing tabs and content here) */}
      <Dialog open={!!selectedAthlete} onClose={() => setSelectedAthlete(null)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#111] p-6 rounded-lg w-full max-w-xl border border-[#1A1A1A]">
          <Dialog.Title className="text-xl text-white font-bold mb-4">
            {selectedAthlete?.name} — Detailed Stats
          </Dialog.Title>

          {/* Keep your existing modal tab buttons and section display here */}

          <div className="text-right mt-6">
            <button onClick={() => setSelectedAthlete(null)} className="text-[#00FF00] hover:underline">Close</button>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
