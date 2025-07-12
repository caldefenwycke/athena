'use client';

import React from 'react';
import { Scale } from 'lucide-react';

interface LegalTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const LegalTab: React.FC<LegalTabProps> = ({ competition, setCompetition, markDirty }) => {
  const legal = competition.settings?.legal || {};

  const updateField = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        legal: {
          ...prev.settings.legal,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ Autosave on change
  };

  return (
    <div className="space-y-6 max-w-xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <Scale size={20} className="text-[#00FF00]" />
        Legal
      </h2>

      {/* Waiver Type Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Waiver Type</label>
        <select
          value={legal.waiverType || 'athena'}
          onChange={(e) => updateField('waiverType', e.target.value)}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
        >
          <option value="athena">Use Athena Default Waiver</option>
          <option value="custom">Upload Your Own Waiver</option>
        </select>
      </div>

      {/* Custom Waiver Input */}
      {legal.waiverType === 'custom' && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Custom Waiver Text</label>
          <textarea
            rows={6}
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            value={legal.customWaiver || ''}
            onChange={(e) => updateField('customWaiver', e.target.value)}
          />
        </div>
      )}

      {/* Template Checkbox */}
      {legal.waiverType === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={legal.useTemplateWaiver || false}
            onChange={(e) => updateField('useTemplateWaiver', e.target.checked)}
          />
          <label className="text-gray-300">Use Athena Template as a Starting Point</label>
        </div>
      )}
    </div>
  );
};

export default LegalTab;


