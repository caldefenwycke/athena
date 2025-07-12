'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import CompetitionRegisterModal from '@/components/public/CompetitionRegisterModal';
import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';

export default function PublicPageInternalView() {
  const router = useRouter();
  const { user } = useAuth();
  const [competition, setCompetition] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [registrationCount, setRegistrationCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const compId = router.query.id as string;

  const refreshRegistrationStatus = async () => {
    if (!compId || !user) return;

    try {
      const compRef = doc(db, 'competitions', compId);
      const compSnap = await getDoc(compRef);

      if (compSnap.exists()) {
        const compData = compSnap.data();
        setCompetition(compData);

        const blockedAthletes = compData.blockedAthletes || [];
        setIsBanned(blockedAthletes.includes(user.uid));

        const regRef = doc(db, 'competitions', compId, 'registrations', user.uid);
        const regSnap = await getDoc(regRef);
        setIsRegistered(regSnap.exists());

        const allRegs = await getDocs(collection(db, 'competitions', compId, 'registrations'));
        setRegistrationCount(allRegs.size);
      }
    } catch (error) {
      console.error('Error refreshing registration status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (compId && user) {
      refreshRegistrationStatus();
    }
  }, [compId, user]);

  const handleUnregister = async () => {
    if (!user) {
      alert('You must be logged in to unregister.');
      return;
    }

    if (!confirm('Are you sure you want to unregister from this competition?')) return;

    try {
      const regRef = doc(db, 'competitions', compId, 'registrations', user.uid);
      await deleteDoc(regRef);
      setIsRegistered(false);
      alert('You have been unregistered.');
    } catch (error) {
      console.error('Unregister failed:', error);
      alert('Failed to unregister. Please try again.');
    }
  };

  const handleOpenRegisterModal = async () => {
    if (!user) {
      alert('You must be logged in to register.');
      return;
    }

    try {
      const compRef = doc(db, 'competitions', compId);
      const compSnap = await getDoc(compRef);

      if (compSnap.exists()) {
        const compData = compSnap.data();
        const blockedAthletes = compData.blockedAthletes || [];

        if (blockedAthletes.includes(user.uid)) {
          alert('You are banned from registering for this competition.');
          return;
        }

        setShowRegisterModal(true);
      } else {
        alert('Competition not found.');
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      alert('Failed to check registration status.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return '';
    return timestamp.toDate().toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <CompetitionPortalLayout>
        <div className="text-white p-6">Loading...</div>
      </CompetitionPortalLayout>
    );
  }

  if (!competition) {
    return (
      <CompetitionPortalLayout>
        <div className="text-white p-6">Competition not found.</div>
      </CompetitionPortalLayout>
    );
  }

  return (
    <CompetitionPortalLayout>
      <div className="max-w-3xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">{competition.name}</h1>

        {competition.imageUrl && (
          <img
            src={competition.imageUrl}
            alt={competition.name}
            className="w-full max-h-80 object-cover mb-4 rounded border border-gray-700"
          />
        )}

        <p className="mb-2"><strong>Location:</strong> {competition.location}</p>
        <p className="mb-2"><strong>Date:</strong> {formatDate(competition.startDate)} - {formatDate(competition.endDate)}</p>
        <p className="mb-2">
          <strong>Registered:</strong> {registrationCount} / {competition.maxAthletes || 'Unlimited'}
        </p>
        <p className="mb-4"><strong>Description:</strong> {competition.description}</p>

        {user && (
          <>
            {isBanned ? (
              <p className="text-red-500 font-bold">🚫 You are banned from participating in this competition.</p>
            ) : isRegistered ? (
              <button
                onClick={handleUnregister}
                className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500"
              >
                Unregister
              </button>
            ) : (
              <button
                onClick={handleOpenRegisterModal}
                className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold hover:bg-[#00cc00]"
              >
                Register to Participate
              </button>
            )}
          </>
        )}

        {!user && (
          <p className="mt-4 text-yellow-400">Please log in to register for this competition.</p>
        )}

        <CompetitionRegisterModal
          competitionId={compId}
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegistered={refreshRegistrationStatus}
        />
      </div>
    </CompetitionPortalLayout>
  );
}