// /pages/dashboard/competition/new.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Layout from '../../../components/Layout';

export default function NewCompetition() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !location || !date) {
      setError('All fields are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'competitions'), {
        name,
        location,
        date: Timestamp.fromDate(new Date(date)),
        status: 'active',
        createdAt: Timestamp.now(),
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#1a1a1a] rounded-xl border border-green-600">
        <h1 className="text-2xl font-bold mb-4 text-white">Create New Competition</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Competition Name"
            className="w-full mb-3 p-2 rounded bg-black text-white border border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full mb-3 p-2 rounded bg-black text-white border border-gray-600"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full mb-4 p-2 rounded bg-black text-white border border-gray-600"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create Competition
          </button>
        </form>
      </div>
    </Layout>
  );
}
