'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/athlete/profile');
  }, [router]);

  return (
    <DashboardLayout>
      <p className="text-white">Redirecting to your Athlete Profile...</p>
    </DashboardLayout>
  );
}

