// pages/competitions.tsx
import Head from 'next/head';
import Header from '@/components/Header';
import { useState } from 'react';

interface Competition {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed';
}

const competitionsData: Competition[] = [
  {
    id: '1',
    title: 'Highland Games Championship',
    description: 'Traditional Scottish athletic competition featuring heavy events',
    image_url: '/images/highland.jpg',
    start_date: '2025-06-01',
    end_date: '2025-06-02',
    status: 'active',
  },
  {
    id: '2',
    title: 'Summer Strongman Classic',
    description: 'Join us for the ultimate test of strength and endurance',
    image_url: '/images/strongman.jpg',
    start_date: '2025-07-15',
    end_date: '2025-07-16',
    status: 'active',
  },
  {
    id: '3',
    title: 'Power Lifting Nationals',
    description: 'National championship for power lifting athletes',
    image_url: '/images/powerlifting.jpg',
    start_date: '2025-08-20',
    end_date: '2025-08-21',
    status: 'active',
  },
];

export default function CompetitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const competitions = competitionsData.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Available Competitions – ATHENA</title>
      </Head>
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-8 text-white tracking-wide">AVAILABLE COMPETITIONS</h1>

          <div className="flex justify-between items-center mb-8">
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xl px-4 py-2 bg-[#111] border border-[#222] rounded text-white mr-4"
            />
            <select className="bg-[#111] text-white border border-[#222] rounded px-4 py-2">
              <option>All Competitions</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((comp) => (
              <div key={comp.id} className="bg-[#111] border border-[#222] rounded overflow-hidden">
                <img
                  src={comp.image_url}
                  alt={comp.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#00FF00] mb-1">{comp.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{comp.description}</p>
                  <div className="text-xs text-gray-400 mb-4">
                    <div><strong>START DATE:</strong> {comp.start_date}</div>
                    <div><strong>END DATE:</strong> {comp.end_date}</div>
                  </div>
                  <div className="flex justify-between">
                    <a href="#" className="text-[#00FF00] hover:underline">VIEW DETAILS</a>
                    <a
                      href="#"
                      className="bg-[#00FF00] text-black font-bold px-4 py-1 rounded hover:bg-[#00DD00]"
                    >
                      JOIN NOW
                    </a>
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
