// pages/index.tsx
import Head from 'next/head';
import Header from '@/components/Header';
import { useState } from 'react';

interface Competition {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  status: 'active' | 'completed';
}

const competitionsData: Competition[] = [
  {
    id: '1',
    title: 'Highland Games Championship',
    description: 'Traditional Scottish athletic competition featuring heavy events',
    image_url: '/images/highland.jpg',
    start_date: '2025-06-01',
    status: 'active',
  },
  {
    id: '2',
    title: 'Summer Strongman Classic',
    description: 'Join us for the ultimate test of strength and endurance',
    image_url: '/images/strongman.jpg',
    start_date: '2025-07-15',
    status: 'active',
  },
  {
    id: '3',
    title: 'Power Lifting Nationals',
    description: 'National championship for power lifting athletes',
    image_url: '/images/powerlifting.jpg',
    start_date: '2025-08-20',
    status: 'active',
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const competitions = competitionsData.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-[#00FF00]">ATH</span>ENA
            </h1>
            <p className="text-lg text-gray-400 mb-2 tracking-wider">ATHLETE ARENA</p>
            <p className="text-md mb-8 tracking-wide">STRONGMAN COMPETITION ADMINISTRATION SYSTEM</p>

            <div className="max-w-2xl mx-auto relative">
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

          <h2 className="text-2xl font-bold text-center mb-6">UPCOMING COMPETITIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors"
              >
                <img
                  src={competition.image_url}
                  alt={competition.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#00FF00] mb-1">{competition.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{competition.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">📅 {competition.start_date}</span>
                    <span className="px-3 py-1 rounded text-xs font-medium bg-[#002200] text-[#00FF00]">
                      {competition.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {competitions.length === 0 && (
            <p className="text-center text-gray-500 mt-12">No competitions to load</p>
          )}
        </main>
      </div>
    </>
  );
}
