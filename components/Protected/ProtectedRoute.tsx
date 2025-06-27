'use client';

import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/ui/AuthModal';
import { useEffect, useState } from 'react';

const BYPASS_AUTH = false;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !user && !BYPASS_AUTH) {
      setShowModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      {user && children}
      {!user && showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
