import CompetitionPortalLayout from '@/components/layouts/CompetitionPortalLayout';
import { useRouter } from 'next/router';

export default function ShowTimePortalPage() {
  const { id } = useRouter().query;

  return (
    <CompetitionPortalLayout>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Show Time</h1>
        <p className="text-sm text-gray-400">Competition ID: {id}</p>
        <p className="mt-4">Live scoring, timers, and judge tools will be built into this page.</p>
      </div>
    </CompetitionPortalLayout>
  );
}
