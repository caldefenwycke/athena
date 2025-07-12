'use client';

import React from 'react';
import { CircleUser } from 'lucide-react';

interface AthleteTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const AthleteTab: React.FC<AthleteTabProps> = ({ competition, setCompetition, markDirty }) => {
  const athlete = competition.settings?.athlete || {};

  const updateField = (field: string, value: any) => {
    markDirty();
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        athlete: {
          ...prev.settings.athlete,
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <CircleUser size={20} className="text-[#00FF00]" />
        Athlete
      </h2>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Registration Close Date</label>
        <input
          type="date"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={athlete.registrationCloseDate || ''}
          onChange={(e) => updateField('registrationCloseDate', e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Max Athlete Count</label>
        <input
          type="number"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={athlete.maxAthletes || ''}
          onChange={(e) => updateField('maxAthletes', parseInt(e.target.value || '0', 10))}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={athlete.requireTshirtSize || false}
          onChange={(e) => updateField('requireTshirtSize', e.target.checked)}
        />
        <label className="text-gray-300">Require T-Shirt Size from Athletes</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={athlete.requireWeightHeight || false}
          onChange={(e) => updateField('requireWeightHeight', e.target.checked)}
        />
        <label className="text-gray-300">Require Weight/Height from Athletes</label>
      </div>
    </div>
  );
};

export default AthleteTab;

