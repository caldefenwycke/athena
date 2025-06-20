import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Dialog } from '@headlessui/react';

interface AthleteStat {
  name: string;
  totalScore: number;
  competitions: number;
  rank: number;
  division: string;
}

const leaderboard: AthleteStat[] = [
  { name: 'Callum De Fenwycke', totalScore: 1125, competitions: 3, rank: 1, division: 'U90kg' },
  { name: 'Tommy Steelback', totalScore: 1040, competitions: 3, rank: 2, division: 'Open' },
  { name: 'Megan Powerstone', totalScore: 1005, competitions: 4, rank: 3, division: 'U75kg' },
  { name: 'Dale Brannigan', totalScore: 995, competitions: 3, rank: 4, division: 'Open' },
  { name: 'Jane Titan', totalScore: 920, competitions: 3, rank: 5, division: 'U75kg' },
  { name: 'Luke Ironjaw', totalScore: 890, competitions: 3, rank: 6, division: 'U90kg' },
  { name: 'Emily Stoneface', totalScore: 870, competitions: 2, rank: 7, division: 'U75kg' },
  { name: 'Bruno Crusher', totalScore: 860, competitions: 3, rank: 8, division: 'Open' },
  { name: 'Sasha Quicklift', totalScore: 850, competitions: 2, rank: 9, division: 'U75kg' },
  { name: 'Zane Boulder', totalScore: 840, competitions: 4, rank: 10, division: 'U90kg' },
];

export default function AthletePerformancePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'global'>('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteStat | null>(null);
  const [modalTab, setModalTab] = useState<'lifts' | 'events' | 'medals'>('lifts');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLeaderboard = leaderboard.filter(
    (athlete) =>
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (divisionFilter === '' || athlete.division === divisionFilter)
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaderboard = filteredLeaderboard.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
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

        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Total Competitions Entered</p>
              <p className="text-xl font-bold">3</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-xl font-bold">1125</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Best Ranking</p>
              <p className="text-xl font-bold">1st Place</p>
            </div>
            <div className="bg-[#222] p-4 rounded">
              <p className="text-sm text-gray-400">Podium Finishes</p>
              <p className="text-xl font-bold">🥇 1 | 🥈 1</p>
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

            <div className="flex flex-wrap gap-2 mb-6">
              <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white">
                <option value="">All Divisions</option>
                <option value="U90kg">U90kg</option>
                <option value="U75kg">U75kg</option>
                <option value="Open">Open</option>
              </select>
              <select className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white">
                <option value="">All Countries</option>
              </select>
              <select className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white">
                <option value="">All Genders</option>
              </select>
              <select className="bg-[#222] border border-[#333] px-3 py-2 rounded text-white">
                <option value="">All Weight Classes</option>
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
                    <tr key={athlete.rank} className="border-t border-[#333] text-white">
                      <td>{athlete.rank === 1 ? '🥇' : athlete.rank === 2 ? '🥈' : athlete.rank === 3 ? '🥉' : `🏅 ${athlete.rank}`}</td>
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

      <Dialog open={!!selectedAthlete} onClose={() => setSelectedAthlete(null)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#111] p-6 rounded-lg w-full max-w-xl border border-[#1A1A1A]">
          <Dialog.Title className="text-xl text-white font-bold mb-4">
            {selectedAthlete?.name} — Detailed Stats
          </Dialog.Title>

          <div className="flex gap-4 mb-4">
            {['lifts', 'events', 'medals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setModalTab(tab as 'lifts' | 'events' | 'medals')}
                className={`px-4 py-2 rounded font-semibold ${modalTab === tab ? 'bg-[#00FF00] text-black' : 'bg-[#222] text-white hover:bg-[#333]'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="text-white space-y-2">
            {modalTab === 'lifts' && (
              <>
                <p>Deadlift: 280kg x 3</p>
                <p>Log Press: 110kg x 5</p>
                <p>Atlas Stone: 140kg x 2</p>
              </>
            )}
            {modalTab === 'events' && (
              <>
                <p>Herm Strongest — 1st Place</p>
                <p>Guernsey Trials — 2nd Place</p>
                <p>Sark Open — 4th Place</p>
              </>
            )}
            {modalTab === 'medals' && (
              <>
                <p>🥇 1 Gold</p>
                <p>🥈 1 Silver</p>
              </>
            )}
          </div>

          <div className="text-right mt-6">
            <button onClick={() => setSelectedAthlete(null)} className="text-[#00FF00] hover:underline">Close</button>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
