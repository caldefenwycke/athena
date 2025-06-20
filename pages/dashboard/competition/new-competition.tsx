// pages/dashboard/competition/new-competition.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function NewCompetition() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleCreate = async () => {
    // Simulate ID creation (replace with Firestore logic if needed)
    const newCompetitionId = `${Date.now()}`;

    // Save logic would go here

    // Redirect to the settings page for the new competition
    router.push(`/dashboard/competition/${newCompetitionId}/settings`);
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
            className="bg-[#00FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#00cc00] mt-4"
          >
            Save & Go to Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
