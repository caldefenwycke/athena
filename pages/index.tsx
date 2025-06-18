// pages/index.tsx
import Head from 'next/head';
import Header from '@/components/Header';
import CompetitionCard from '@/components/CompetitionCard';

const competitions = [
  {
    title: 'National Championship 2023',
    description: 'Annual national championship event',
    date: '15/11/2023',
    status: 'COMPLETED',
  },
  {
    title: 'Spring Classic 2024',
    description: 'Spring season major competition',
    date: '01/03/2024',
    status: 'COMPLETED',
  },
  {
    title: 'Summer Strongman Championship',
    description: 'Annual summer strongman competition featuring multiple weight classes',
    date: '01/07/2024',
    status: 'ACTIVE',
  },
  {
    title: 'Winter Power League',
    description: 'Winter season power lifting and strongman events',
    date: '01/11/2024',
    status: 'ACTIVE',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>
      <div className="bg-black min-h-screen text-white">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-2">Welcome to ATHENA</h1>
          <p className="text-gray-300 mb-6">
            Explore competitions, manage athletes, and run strongman events with ease.
          </p>
          <div className="max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder="Search competitions..."
              className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
            />
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Upcoming Competitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp, idx) => (
              <CompetitionCard key={idx} {...comp} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
