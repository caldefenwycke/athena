'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const BYPASS_ADMIN_AUTH = false; // ✅ Set to false to enforce real admin-only access

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/login');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Checking admin permissions...
      </div>
    );
  }

  return <>{user && role === 'admin' ? children : null}</>;
}

