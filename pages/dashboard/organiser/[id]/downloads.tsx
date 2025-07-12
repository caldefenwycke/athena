'use client';

import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import { Download } from 'lucide-react';

export default function DownloadsPage() {
  return (
    <CompetitionPortalLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
          <Download size={20} className="text-[#00FF00]" />
          DOWNLOADS
        </h2>
        <p className="text-gray-400">This is the downloads page. Content coming soon...</p>
      </div>
    </CompetitionPortalLayout>
  );
}