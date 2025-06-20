import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const BYPASS_ADMIN_AUTH = true; // 🔧 Set to false to enforce real admin-only access

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // ✅ Temporary bypass for development
  if (BYPASS_ADMIN_AUTH) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/login');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  return <>{user && role === 'admin' ? children : null}</>;
}
