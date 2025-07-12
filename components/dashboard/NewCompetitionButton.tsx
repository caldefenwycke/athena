'use client';

import { useRouter } from 'next/router';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import defaultCompetitionSettings from '@/lib/defaultCompetitionSettings';
import GreenButton from '@/components/ui/GreenButton';

export default function NewCompetitionButton() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCreate = async () => {
    if (!user) return;

    const compRef = doc(collection(db, 'competitions'));
    const newId = compRef.id;

    const fullCompetitionDoc = {
      ...defaultCompetitionSettings,
      organizerId: user.uid,
      id: newId,
    };

    try {
      await setDoc(compRef, fullCompetitionDoc, { merge: true });
      router.push(`/dashboard/organiser/${newId}/settings`);
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  };

  return (
    <GreenButton onClick={handleCreate}>
      + New Competition
    </GreenButton>
  );
}




