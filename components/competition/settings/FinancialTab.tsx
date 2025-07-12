'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

interface FinancialTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ competition, setCompetition, markDirty }) => {
  const financial = competition.settings?.financial || {};

  const updateField = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        financial: {
          ...prev.settings.financial,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ Trigger autosave
  };

  return (
    <div className="space-y-6 max-w-xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <CreditCard size={20} className="text-[#00FF00]" />
        Financial
      </h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Registration Cost (£)</label>
        <input
          type="number"
          min="0"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={financial.registrationCost ?? ''}
          onChange={(e) => updateField('registrationCost', parseFloat(e.target.value || '0'))}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Prize Purse (£)</label>
        <input
          type="number"
          min="0"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={financial.prizePurse ?? ''}
          onChange={(e) => updateField('prizePurse', parseFloat(e.target.value || '0'))}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={financial.extraTshirtCost ? true : false}
          onChange={(e) => updateField('extraTshirtCost', e.target.checked ? 5 : 0)}
        />
        <label className="text-gray-300">Offer Extra T-Shirt Purchase Option</label>
      </div>
    </div>
  );
};

export default FinancialTab;



