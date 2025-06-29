// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Competition {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  status: string;
}

export default function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCompetitions = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const competitionsRef = collection(db, 'competitions');
      const q = lastDoc
        ? query(competitionsRef, orderBy('startDate'), startAfter(lastDoc), limit(6))
        : query(competitionsRef, orderBy('startDate'), limit(6));

      const snapshot = await getDocs(q);

      const newCompetitions: Competition[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          startDate: data.startDate.toDate().toISOString(),
          status: data.status,
        };
      });

      setCompetitions((prev) => [...prev, ...newCompetitions]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (snapshot.docs.length < 6) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading competitions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500 &&
      hasMore &&
      !loading
    ) {
      loadCompetitions();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const formatDateUK = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB');
  };

  const filteredCompetitions = competitions.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <main className="max-w-7xl mx-auto px-4 py-12">

          {/* Hero Section */}
          <div className="text-center mb-20 py-12 bg-black rounded-lg">
            <h1 className="text-8xl font mb-4 leading-tight">
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
                className="w-full px-6 py-3 bg-black border border-[#00FF00] rounded-lg text-white focus:outline-none"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00FF00]">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {/* Competitions Grid */}
          <h2 className="text-2xl font-bold text-center mt-20 mb-6">UPCOMING COMPETITIONS</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <Link key={competition.id} href={`/public-competition/${competition.id}`}>
                <div
                  className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors cursor-pointer"
                >
                  {/* Fixed-size Branding Image */}
                  <img
                    src={competition.imageUrl}
                    alt={competition.name}
                    className="w-full h-40 object-cover"
                  />

                  {/* Competition Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#00FF00] mb-1">
                      {competition.name}
                    </h3>

                    {/* One-line Description Excerpt */}
                    <p className="text-sm text-gray-300 truncate mb-2">
                      {competition.description}
                    </p>

                    {/* Date + Status */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        📅 {formatDateUK(competition.startDate)}
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-[#002200] text-[#00FF00]">
                        {competition.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mt-6">Loading more competitions...</p>
          )}

          {/* No more */}
          {!hasMore && (
            <p className="text-center text-gray-500 mt-6">No more competitions to load</p>
          )}

          {/* No search results */}
          {filteredCompetitions.length === 0 && !loading && (
            <p className="text-center text-gray-500 mt-6">No competitions found</p>
          )}
        </main>
      </div>
    </>
  );
}


