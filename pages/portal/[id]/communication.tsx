import CompetitionPortalLayout from '@/components/layouts/CompetitionPortalLayout';
import { useRouter } from 'next/router';

export default function CommunicationPortalPage() {
  const { id } = useRouter().query;

  return (
    <CompetitionPortalLayout>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Communication Center</h1>
        <p className="text-sm text-gray-400">Competition ID: {id}</p>
        <p className="mt-4">Messaging tools and notices will go here.</p>
      </div>
    </CompetitionPortalLayout>
  );
}
