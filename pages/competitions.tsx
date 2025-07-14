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
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadCompetitions = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const competitionsRef = collection(db, 'competitions');

      let q = query(competitionsRef, orderBy('startDate'));

      if (statusFilter !== 'all') {
        q = query(competitionsRef, where('status', '==', statusFilter), orderBy('startDate'));
      }

      q = lastDoc ? query(q, startAfter(lastDoc), limit(6)) : query(q, limit(6));

      const snapshot = await getDocs(q);

      const newCompetitions: Competition[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const regSnap = await getDocs(collection(db, 'competitions', docSnap.id, 'registrations'));

          return {
            id: docSnap.id,
            name: data.name || 'Untitled',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            startDate: data.startDate?.toDate().toISOString() || '',
            status: data.status || 'unknown',
            maxAthletes: data.maxAthletes,
            registrationCount: regSnap.size,
          };
        })
      );

      setCompetitions((prev) => [...prev, ...newCompetitions]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      if (snapshot.docs.length < 6) setHasMore(false);
    } catch (error) {
      console.error('Error loading competitions:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setCompetitions([]);
    setLastDoc(null);
    setHasMore(true);
    loadCompetitions();
  }, [statusFilter]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      hasMore &&
      !loading
    ) {
      loadCompetitions();
    }
  };

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
        <title>Browse Competitions – ATHENA</title>
      </Head>
      <div className="min-h-screen bg-black text-white">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-white tracking-wide text-center">
            BROWSE COMPETITIONS
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-lg px-4 py-2 bg-[#111] border border-[#00FF00] rounded text-white"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#111] border border-[#00FF00] text-white rounded"
            >
              <option value="all">All Competitions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Competitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <Link key={competition.id} href={`/public/competitions/${competition.id}`}>
                <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#00FF00] transition-colors cursor-pointer">
                  <img
                    src={competition.imageUrl}
                    alt={competition.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#00FF00] mb-1">{competition.name}</h3>
                    <p className="text-sm text-gray-300 truncate mb-2">{competition.description}</p>
                    <p className="text-sm text-gray-400 mb-1">📅 {formatDateUK(competition.startDate)}</p>
                    <p className="text-sm text-gray-400">
                      Registered: {competition.registrationCount || 0} /{' '}
                      {competition.maxAthletes || 'Unlimited'} spaces
                    </p>
                    <div className="mt-2">
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
          {loading && <p className="text-center text-gray-400 mt-6">Loading more competitions...</p>}

          {/* No More */}
          {!hasMore && competitions.length > 0 && (
            <p className="text-center text-gray-500 mt-6">No more competitions to load</p>
          )}

          {/* No Results */}
          {filteredCompetitions.length === 0 && !loading && (
            <p className="text-center text-gray-500 mt-6">No competitions found</p>
          )}
        </main>
      </div>
    </>
  );
}
