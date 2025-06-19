// components/Protected/AdminRoute.tsx
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!loading && clientReady) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'admin') {
        router.push('/unauthorized'); // Optional: Create an unauthorized page
      }
    }
  }, [user, role, loading, clientReady, router]);

  if (loading || !clientReady || !user || role !== 'admin') {
    return <p className="p-8 text-white">Checking access...</p>;
  }

  return <>{children}</>;
}
