'use client';

import { ClipboardList } from 'lucide-react';
import AutoSaveSection from '@/components/common/AutoSaveSection';

interface BasicTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

export default function BasicTab({ competition, setCompetition, markDirty }: BasicTabProps) {
  const basic = competition.settings?.basic || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        basic: {
          ...prev.settings.basic,
          [name]: value,
        },
      },
    }));

    markDirty(); // ✅ Trigger dirty state
  };

  return (
    <div className="space-y-6 max-w-2xl p-6">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <ClipboardList size={20} className="text-[#00FF00]" />
        Basic
      </h2>

      <AutoSaveSection markDirty={markDirty}>
        {[
          { label: 'Competition Name', key: 'name' },
          { label: 'Location', key: 'location' },
          { label: 'Start Date', key: 'startDate', type: 'date' },
          { label: 'End Date', key: 'endDate', type: 'date' }
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              name={key}
              value={basic[key] || ''}
              onChange={handleChange}
              type={type || 'text'}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            />
          </div>
        ))}
      </AutoSaveSection>
    </div>
  );
}



