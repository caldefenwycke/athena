import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && role !== 'admin') {
      router.push('/dashboard'); // redirect if not admin
    }
  }, [user, role, router]);

  if (!user || role !== 'admin') return null;

  return <>{children}</>;
}
