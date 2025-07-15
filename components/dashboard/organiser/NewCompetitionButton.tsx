'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import defaultCompetitionSettings from '@/utils/defaultCompetitionSettings';

export default function NewCompetitionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const router = useRouter();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return alert('Please log in.');

    try {
      const id = `${user.uid}_${Date.now()}`;
      const newCompRef = doc(db, 'competitions', id);

      const competitionData = {
        organizerId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        settings: {
          ...defaultCompetitionSettings.settings,
          basic: {
            ...defaultCompetitionSettings.settings.basic,
            name,
            location,
            startDate,
            endDate,
            organiserName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            organiserEmail: user.email,
            organiserPhone: user.phoneNumber || '',
          },
        },
        overview: defaultCompetitionSettings.overview,
        communication: defaultCompetitionSettings.communication,
      };

      await setDoc(newCompRef, competitionData);
      setIsOpen(false);
      router.push(`/dashboard/organiser/${id}/settings`);
    } catch (err) {
      console.error('Error creating competition:', err);
      alert('Failed to create competition.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#00FF00] text-black px-4 py-2 rounded hover:bg-[#00e600]"
      >
        + New Competition
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-[#111] border border-[#333] p-6 rounded-lg">
            <Dialog.Title className="text-lg text-white font-bold mb-4">Create Competition</Dialog.Title>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-3 bg-[#222] text-white border border-[#333] rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 mb-3 bg-[#222] text-white border border-[#333] rounded"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 mb-3 bg-[#222] text-white border border-[#333] rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 mb-6 bg-[#222] text-white border border-[#333] rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-[#00FF00] text-black px-4 py-1 rounded hover:bg-[#00e600]"
              >
                Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

