'use client';

import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import { CreditCard } from 'lucide-react';

export default function FinancialPage() {
  return (
    <CompetitionPortalLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-[#00FF00]" />
          FINANCIAL
        </h2>
        <p className="text-gray-400">This is the financial page. Content coming soon...</p>
      </div>
    </CompetitionPortalLayout>
  );
}
