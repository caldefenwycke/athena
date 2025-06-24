import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function NewCompetition() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!user || !name || !location || !date) return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'competitions'), {
        title: name,
        description: '', // You can make this a field on the form later
        location,
        date: Timestamp.fromDate(new Date(date)),
        status: 'active', // default to active
        organizerId: user.uid,
      });

      router.push(`/dashboard/competition/${docRef.id}/settings`);
    } catch (err) {
      console.error('Error creating competition:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Competition</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Competition Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className={`bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00] mt-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Save & Go to Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
