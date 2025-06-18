// pages/index.tsx
import { useState } from 'react';
import Head from 'next/head';

interface Competition {
  id: string;
  title: string;
  description: string;
  start_date: string;
  status: 'active' | 'completed';
  image_url?: string;
}

const placeholderCompetitions: Competition[] = [
  {
    id: '1',
    title: 'National Championship 2023',
    description: 'Annual national championship event',
    start_date: '2023-11-15',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Spring Classic 2024',
    description: 'Spring season major competition',
    start_date: '2024-03-01',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Summer Strongman Championship',
    description: 'Annual summer strongman competition featuring multiple weight classes',
    start_date: '2024-07-01',
    status: 'active'
  }
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const competitions = placeholderCompetitions.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-black border-b border-[#1A1A1A] px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-white">
              <span className="text-[#00FF00]">ATH</span>ENA
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="text-white hover:text-[#00FF00]">Home</a>
              <a href="/competitions" className="text-white hover:text-[#00FF00]">Competitions</a>
              <a href="/dashboard" className="text-white hover:text-[#00FF00]">Dashboard</a>
              <a href="/support" className="text-white hover:text-[#00FF00]">Support</a>
              <a href="/account/signin" className="px-4 py-1 bg-[#00FF00] text-black font-semibold rounded hover:bg-[#00DD00]">Sign In</a>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-[#00FF00]">ATH</span>ENA
            </h1>
            <p className="text-lg text-gray-400 mb-2 tracking-wider">ATHLETE ARENA</p>
            <p className="text-md mb-8 tracking-wide">STRONGMAN COMPETITION ADMINISTRATION SYSTEM</p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search competitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#00FF00]"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00FF00]">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">UPCOMING COMPETITIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#00FF00] mb-1">{competition.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{competition.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">📅 {new Date(competition.start_date).toLocaleDateString()}</span>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        competition.status === 'active'
                          ? 'bg-[#002200] text-[#00FF00]'
                          : 'bg-[#222] text-gray-300'
                      }`}
                    >
                      {competition.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
