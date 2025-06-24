'use client';

import ShowtimeLayout from '@/components/layouts/ShowtimeLayout';
import ShowTimeOverview from '@/components/showtime/ShowTimeOverview';

export default function ShowTimePage() {
  return (
    <ShowtimeLayout>
      <h1 className="text-3xl font-bold mb-6">Herm Strongest Show Time</h1>
      <ShowTimeOverview />
    </ShowtimeLayout>
  );
}
