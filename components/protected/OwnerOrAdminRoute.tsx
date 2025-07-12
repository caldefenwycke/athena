'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OwnerOrAdminRouteProps {
  children: React.ReactNode;
}

export default function OwnerOrAdminRoute({ children }: OwnerOrAdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !id || typeof id !== 'string') return setAllowed(false);

      const compRef = doc(db, 'competitions', id);
      const snap = await getDoc(compRef);

      if (!snap.exists()) return setAllowed(false);

      const data = snap.data();
      const isOwner = data.organizerId === user.uid;
      const isAdmin = user.role === 'admin';

      setAllowed(isOwner || isAdmin);
    };

    if (!authLoading && id) {
      checkAccess();
    }
  }, [user, authLoading, id]);

  if (authLoading || allowed === null) {
    return <LoadingSpinner fullscreen />;
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
