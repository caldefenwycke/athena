// pages/index.tsx
'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PublicLayout from '@/components/layout/PublicLayout';

interface Competition {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  status: string;
  maxAthletes?: number;
  registrationCount?: number;
}

export default function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCompetitions();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadCompetitions = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const baseQuery = query(
        collection(db, 'competitions'),
        orderBy('startDate'),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(6)
      );

      const snapshot = await getDocs(baseQuery);
      const newComps: Competition[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const regSnap = await getDocs(
            collection(db, 'competitions', docSnap.id, 'registrations')
          );

          return {
            id: docSnap.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            startDate: data.startDate.toDate().toISOString(),
            status: data.status,
            maxAthletes: data.maxAthletes,
            registrationCount: regSnap.size,
          };
        })
      );

      setCompetitions((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueComps = newComps.filter((c) => !existingIds.has(c.id));
        return [...prev, ...uniqueComps];
      });

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      if (snapshot.docs.length < 6) setHasMore(false);
    } catch (err) {
      console.error('Error loading competitions:', err);
    }

    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      hasMore &&
      !loading
    ) {
      loadCompetitions();
    }
  };

  const formatDateUK = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB');

  const filtered = competitions.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PublicLayout>
      <Head>
        <title>ATHENA – Strongman Admin System</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12 text-white">
        {/* Hero Section */}
        <div className="text-center mb-20 py-12 bg-black rounded-lg">
          <h1 className="text-8xl font mb-4 leading-tight">
            <span className="text-[#00FF00]">ATH</span>ENA
          </h1>
          <p className="text-lg text-gray-400 mb-2 tracking-wider">ATHLETE ARENA</p>
          <p className="text-md mb-8 tracking-wide">
            STRONGMAN COMPETITION ADMINISTRATION SYSTEM
          </p>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-black border border-[#00FF00] rounded-lg text-white"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00FF00]">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Competition Grid */}
        <h2 className="text-2xl font-bold text-center mt-20 mb-6">
          UPCOMING COMPETITIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <Link key={comp.id} href={`/public/competitions/${comp.id}`}>
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors cursor-pointer">
                <img
                  src={comp.imageUrl}
                  alt={comp.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#00FF00] mb-1">
                    {comp.name}
                  </h3>
                  <p className="text-sm text-gray-300 truncate mb-2">
                    {comp.description}
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    📅 {formatDateUK(comp.startDate)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Registered: {comp.registrationCount || 0} /{' '}
                    {comp.maxAthletes || 'Unlimited'} spaces
                  </p>
                  <div className="mt-2">
                    <span className="px-3 py-1 rounded text-xs font-medium bg-[#002200] text-[#00FF00]">
                      {comp.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll Feedback */}
        {loading && hasMore && (
          <p className="text-center text-gray-400 mt-6">Loading more competitions...</p>
        )}
        {!hasMore && competitions.length > 0 && (
          <p className="text-center text-gray-500 mt-6">No more competitions to load</p>
        )}
        {!loading && competitions.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No competitions found</p>
        )}
      </main>
    </PublicLayout>
  );
}


