'use client';

import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import { BarChart2 } from 'lucide-react';

export default function PublicscoresPage() {
  return (
    <CompetitionPortalLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
          <BarChart2 size={20} className="text-[#00FF00]" />
          PUBLIC SCORES
        </h2>
        <p className="text-gray-400">This is the public scores page. Content coming soon...</p>
      </div>
    </CompetitionPortalLayout>
  );
}
