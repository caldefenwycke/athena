'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/ui/modals/AuthModal';
import LoadingSpinner from '@/components/ui/main/LoadingSpinner';
import { useEffect, useState } from 'react';

const BYPASS_AUTH = false; // Set to true ONLY for dev testing

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !user && !BYPASS_AUTH) {
      setShowModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  if (!user && showModal) {
    return <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />;
  }

  return <>{user && children}</>;
}