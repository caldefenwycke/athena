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
    status: 'completed',
    image_url: ''
  },
  {
    id: '2',
    title: 'Spring Classic 2024',
    description: 'Spring season major competition',
    start_date: '2024-03-01',
    status: 'completed',
    image_url: ''
  },
  {
    id: '3',
    title: 'Summer Strongman Championship',
    description: 'Annual summer strongman competition featuring multiple weight classes',
    start_date: '2024-07-01',
    status: 'active',
    image_url: ''
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
      <div className="min-h-screen flex flex-col bg-black text-white">
        <nav className="bg-[#00FF00] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-black">ATHENA</a>
            <div className="flex items-center gap-6 text-black font-semibold">
              <a href="/" className="hover:underline">Home</a>
              <a href="/competitions" className="hover:underline">Competitions</a>
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/support" className="hover:underline">Support</a>
              <a href="/account/signin" className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">Sign In</a>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto mt-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-2 text-[#00FF00]">Welcome to ATHENA</h1>
              <p className="text-xl mb-2 text-gray-400 tracking-wide">ATHLETE ARENA</p>
              <p className="text-md mb-10 tracking-wide">STRONGMAN COMPETITION ADMINISTRATION SYSTEM</p>
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-3 bg-[#111111] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF00]"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00FF00]">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">UPCOMING COMPETITIONS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#00FF00]">
                      {competition.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">
                        📅 {new Date(competition.start_date).toLocaleDateString()}
                      </div>
                      <div
                        className={`px-3 py-1 rounded ${
                          competition.status === 'active'
                            ? 'bg-[#002200] text-[#00FF00]'
                            : 'bg-[#222222] text-gray-300'
                        }`}
                      >
                        {competition.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
