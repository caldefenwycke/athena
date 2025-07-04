import CompetitionPortalLayout from '@/components/layouts/CompetitionPortalLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PublicPage() {
  const router = useRouter();
  const { id } = router.query;

  const [competition, setCompetition] = useState<any>(null);
  const [registrationCount, setRegistrationCount] = useState<number>(0);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return;

      const docRef = doc(db, 'competitions', id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompetition(data);

        // Fetch registration count from subcollection
        const regSnap = await getDocs(collection(db, 'competitions', id as string, 'registrations'));
        setRegistrationCount(regSnap.size);
      }
    };

    fetchCompetition();
  }, [id]);

  if (!competition) {
    return (
      <CompetitionPortalLayout>
        <p className="text-white">Loading competition...</p>
      </CompetitionPortalLayout>
    );
  }

  return (
    <CompetitionPortalLayout>
      <div className="text-white max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{competition.name}</h1>

        {competition.imageUrl && (
          <img
            src={competition.imageUrl}
            alt={competition.name}
            className="w-full max-h-[300px] object-cover rounded mb-6"
          />
        )}

        <p><strong>Location:</strong> {competition.location}</p>
        <p>
          <strong>Date:</strong>{' '}
          {competition.startDate?.toDate?.().toLocaleDateString?.() ||
            new Date(competition.startDate).toLocaleDateString()}{' '}
          -{' '}
          {competition.endDate?.toDate?.().toLocaleDateString?.() ||
            new Date(competition.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Registered:</strong> {registrationCount} /{' '}
          {competition.maxAthletes || 'Unlimited'}
        </p>
        <p><strong>Description:</strong> {competition.description || '—'}</p>
      </div>
    </CompetitionPortalLayout>
  );
}

