import React from 'react';
import { useRouter } from 'next/router';
import ShowtimeSidebar from '../showtime/ShowtimeSidebar';

interface ShowtimeLayoutProps {
  children: React.ReactNode;
}

export default function ShowtimeLayout({ children }: ShowtimeLayoutProps) {
  const router = useRouter();
  let competitionId: string | null = null;

  if (typeof router.query.competitionId === 'string') {
    competitionId = router.query.competitionId;
  } else {
    // fallback parsing from URL path
    const segments = router.asPath.split('/');
    competitionId = segments[segments.indexOf('show-time') + 1] || null;
  }

  if (!competitionId) {
    return <div>Invalid or missing competition ID</div>;
  }

  return (
    <div className="flex">
      <ShowtimeSidebar competitionId={competitionId} />
      <main className="flex-1 mt-6">{children}</main>
    </div>
  );
}
