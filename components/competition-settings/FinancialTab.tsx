// components/dashboard/competition/settings/tabs/FinancialTab.tsx
import React from 'react';

interface FinancialTabProps {
  competition: {
    registrationCost: number;
    prizePurse: number;
    extraTshirtOption: boolean;
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ competition, setCompetition }) => {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Registration Cost (£)</label>
        <input
          type="number"
          min="0"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.registrationCost}
          onChange={(e) =>
            setCompetition({ ...competition, registrationCost: parseFloat(e.target.value || '0') })
          }
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Prize Purse (£)</label>
        <input
          type="number"
          min="0"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.prizePurse}
          onChange={(e) =>
            setCompetition({ ...competition, prizePurse: parseFloat(e.target.value || '0') })
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={competition.extraTshirtOption}
          onChange={(e) =>
            setCompetition({ ...competition, extraTshirtOption: e.target.checked })
          }
        />
        <label className="text-gray-300">Offer Extra T-Shirt Purchase Option</label>
      </div>
    </div>
  );
};

export default FinancialTab;
