import CompetitionPortalLayout from '@/components/layouts/CompetitionPortalLayout';
import { useRouter } from 'next/router';

export default function PublicPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <CompetitionPortalLayout>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Public Competition Page</h1>
        <p className="text-sm text-gray-400">Competition ID: {id}</p>
        <p className="mt-4">This page will display the public-facing competition content (logo, name, location, date, etc.).</p>
      </div>
    </CompetitionPortalLayout>
  );
}
