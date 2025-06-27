'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const BYPASS_AUTH = false; // ✅ Must be false to enforce real authentication

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Checking authentication...
      </div>
    );
  }

  return <>{user ? children : null}</>;
}

