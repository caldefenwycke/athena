'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import { logSystemEvent } from '@/lib/logSystemEvent';
import { Trash2 } from 'lucide-react';

interface DeleteTabProps {
  competition: any;
}

export default function DeleteTab({ competition }: DeleteTabProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const deleteCompetitionAndSubcollections = async (compId: string) => {
    const subcollections = ['registrations', 'scores', 'events', 'divisions', 'weights'];
    for (const sub of subcollections) {
      const subColRef = collection(db, 'competitions', compId, sub);
      const subSnap = await getDocs(subColRef);
      const deletePromises = subSnap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    }
    await deleteDoc(doc(db, 'competitions', compId));
  };

  const handleDelete = async () => {
    const compId = router.query.id as string;
    const compName = competition.name || competition.settings?.basic?.name;
    if (!compId || confirmText !== compName) return;

    try {
      setLoading(true);
      await deleteCompetitionAndSubcollections(compId);

      if (user) {
        await logSystemEvent({
          action: 'Competition Deleted',
          performedBy: user.uid,
          competitionId: compId,
          details: `Deleted competition "${compName}"`,
        });
      }

      alert('Competition and all related data deleted successfully.');
      router.push('/dashboard/competitions/');
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('Failed to delete competition. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const compName = competition.name || competition.settings?.basic?.name || '';

  return (
    <div className="space-y-6 p-6 text-white w-full max-w-5xl">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <Trash2 size={20} className="text-[#00FF00]" />
        Delete
      </h2>

      {competition.status === 'past' ? (
        <div className="text-red-500 bg-[#220000] border border-red-800 p-6 rounded w-full">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Trash2 size={20} className="text-red-500" />
            Deletion Disabled
          </h2>
          <p>
            This competition is marked as <strong>past</strong> and cannot be deleted
            to protect athlete rankings and history.
          </p>
        </div>
      ) : (
        <div className="bg-[#110000] border border-red-800 p-6 rounded w-full">
          <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-4">
            <Trash2 size={20} className="text-red-500" />
            Danger Zone: Delete Competition
          </h2>

          <p className="mb-4 text-white">
            This will permanently delete this competition and all related registrations, scores, and settings.
            This action is irreversible.
          </p>

          <p className="mb-2 text-white">
            Type the competition name below to confirm deletion: <strong>{compName}</strong>
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type competition name to confirm"
            className="w-full p-2 mb-4 rounded border border-red-500 bg-black text-white"
          />

          <button
            disabled={confirmText !== compName || loading}
            onClick={handleDelete}
            className={`px-6 py-2 font-bold rounded ${
              confirmText === compName
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Deleting...' : 'Permanently Delete Competition'}
          </button>
        </div>
      )}
    </div>
  );
}



