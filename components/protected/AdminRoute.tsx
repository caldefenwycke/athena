'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const BYPASS_ADMIN_AUTH = false;

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== 'admin') && !BYPASS_ADMIN_AUTH) {
      router.push('/');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  if (!user || role !== 'admin') return null;

  return <>{children}</>;
}
