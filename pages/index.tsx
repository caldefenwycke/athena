import { useEffect, useState } from 'react';
import Head from 'next/head';

interface Competition {
  id: string;
  title: string;
  description: string;
  start_date: string;
  status: 'active' | 'completed';
  image_url?: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/listCompetitions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 12, sort: 'start_date', order: 'asc' })
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setCompetitions(data.competitions || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Header Nav */}
        <nav className="bg-[#00FF00] text-black">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-black">
                ATHENA
              </a>
              <div className="flex items-center gap-6 text-sm font-semibold">
                <a href="/" className="hover:underline">Home</a>
                <a href="/competitions" className="hover:underline">Competitions</a>
                <a href="/dashboard" className="hover:underline">Dashboard</a>
                <a href="/support" className="hover:underline">Support</a>
                <a href="/account/signin" className="hover:underline text-white bg-black px-3 py-1 rounded">Sign In</a>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto mt-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 text-[#00FF00]">Welcome to ATHENA</h1>
              <p className="text-gray-300 mb-6">
                Explore competitions, manage athletes, and run strongman events with ease.
              </p>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search competitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-white">UPCOMING COMPETITIONS</h2>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden hover:border-[#00FF00] transition"
                  >
                    {competition.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={competition.image_url}
                          alt={competition.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-[#00FF00]">{competition.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{competition.description}</p>
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
            )}
          </div>
        </main>
      </div>
    </>
  );
}
