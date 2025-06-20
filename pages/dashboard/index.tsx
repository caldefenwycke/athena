import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/athlete/profile');
  }, [router]);

  return null;
}
