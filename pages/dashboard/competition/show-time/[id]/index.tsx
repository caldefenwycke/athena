'use client';

import ShowTimeLayout from '@/components/layouts/ShowTimeLayout';
import ShowTimeOverview from '@/components/show-time/ShowTimeOverview';

export default function ShowTimePage() {
  return (
    <ShowTimeLayout>
      <h1 className="text-3xl font-bold mb-6">Herm Strongest Show Time</h1>
      <ShowTimeOverview />
    </ShowTimeLayout>
  );
}
