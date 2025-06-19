// pages/dashboard/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/athlete/profile');
  }, [router]);

  return null; // You can also show a loading spinner here if desired
}
