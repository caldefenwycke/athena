// components/dashboard/competition/settings/tabs/LegalTab.tsx
import React from 'react';

interface CompetitionType {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  image: string;
  imageFile: File | null;
  registrationCloseDate: string;
  maxAthletes: number;
  requireTshirtSize: boolean;
  requireWeightHeight: boolean;
  events: any[];
  sanctioningBody: string;
  tieBreakerRule: string;
  rulesDoc: string;
  registrationCost: number;
  prizePurse: number;
  extraTshirtOption: boolean;
  waiverType: 'athena' | 'custom';
  customWaiver: string;
  useTemplateWaiver: boolean;
  sponsorName: string;
  sponsorLogo: string;
}

interface LegalTabProps {
  competition: CompetitionType;
  setCompetition: React.Dispatch<React.SetStateAction<CompetitionType>>;
}

const LegalTab: React.FC<LegalTabProps> = ({ competition, setCompetition }) => {
  return (
    <div className="space-y-6 max-w-xl">
      {/* Waiver Type Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Waiver Type</label>
        <select
          value={competition.waiverType}
          onChange={(e) =>
            setCompetition({ ...competition, waiverType: e.target.value as 'athena' | 'custom' })
          }
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
        >
          <option value="athena">Use Athena Default Waiver</option>
          <option value="custom">Upload Your Own Waiver</option>
        </select>
      </div>

      {/* Custom Waiver Input */}
      {competition.waiverType === 'custom' && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Custom Waiver Text</label>
          <textarea
            rows={6}
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
            value={competition.customWaiver}
            onChange={(e) =>
              setCompetition({ ...competition, customWaiver: e.target.value })
            }
          />
        </div>
      )}

      {/* Template Checkbox */}
      {competition.waiverType === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={competition.useTemplateWaiver}
            onChange={(e) =>
              setCompetition({ ...competition, useTemplateWaiver: e.target.checked })
            }
          />
          <label className="text-gray-300">Use Athena Template as a Starting Point</label>
        </div>
      )}
    </div>
  );
};

export default LegalTab;
