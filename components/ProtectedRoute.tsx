// components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && role !== 'admin') {
        router.push('/unauthorized');
      }
    }
  }, [user, role, loading, router, requireAdmin]);

  if (loading || !user || (requireAdmin && role !== 'admin')) return null;

  return <>{children}</>;
}
