'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DeleteTabProps {
  competition: any;
}

export default function DeleteTab({ competition }: DeleteTabProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const deleteCompetitionAndSubcollections = async (compId: string) => {
    const subcollections = ['registrations', 'scores']; // Add more if needed later

    for (const sub of subcollections) {
      const subColRef = collection(db, 'competitions', compId, sub);
      const subSnap = await getDocs(subColRef);
      const deletePromises = subSnap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    }

    // Finally delete the main competition document
    await deleteDoc(doc(db, 'competitions', compId));
  };

  const handleDelete = async () => {
    if (confirmText !== competition.name) return;

    try {
      setLoading(true);
      const compId = router.query.id as string;
      await deleteCompetitionAndSubcollections(compId);
      alert('Competition and all related data deleted successfully.');
      router.push('/dashboard/competition/my-competitions');
    } catch (error) {
      console.error('Error deleting competition:', error);
      alert('Failed to delete competition. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (competition.status === 'past') {
    return (
      <div className="text-red-500 bg-[#220000] border border-red-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Deletion Disabled</h2>
        <p>
          This competition is marked as <strong>past</strong> and cannot be deleted
          to protect athlete rankings and history.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#110000] border border-red-800 p-6 rounded">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Danger Zone: Delete Competition</h2>
      <p className="mb-4 text-white">
        This will permanently delete this competition and all related registrations, scores, and settings.
        This action is irreversible.
      </p>

      <p className="mb-2 text-white">
        Type the competition name below to confirm deletion: <strong>{competition.name}</strong>
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type competition name to confirm"
        className="w-full p-2 mb-4 rounded border border-red-500 bg-black text-white"
      />

      <button
        disabled={confirmText !== competition.name || loading}
        onClick={handleDelete}
        className={`px-6 py-2 font-bold rounded ${
          confirmText === competition.name
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Deleting...' : 'Permanently Delete Competition'}
      </button>
    </div>
  );
}
