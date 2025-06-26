import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function NewCompetition() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user || !name.trim()) {
      alert('Please enter a competition name and ensure you are logged in.');
      return;
    }

    const docRef = await addDoc(collection(db, 'competitions'), {
      name: name,
      status: 'active',
      organizerId: user.uid,
      createdAt: Timestamp.now(),
    });

    router.push(`/dashboard/competition/${docRef.id}/settings`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create New Competition</h1>
        <input
          type="text"
          placeholder="Competition Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#222] text-white border border-[#333] mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#00FF00] hover:bg-[#00cc00] text-black font-bold px-6 py-2 rounded"
        >
          Save and Go to Settings
        </button>
      </div>
    </DashboardLayout>
  );
}
