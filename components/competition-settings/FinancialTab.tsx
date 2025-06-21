import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const FinancialTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Athlete Registration Cost (£)</label>
        <input
          type="number"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.registrationCost}
          onChange={(e) =>
            setCompetition({ ...competition, registrationCost: parseFloat(e.target.value || '0') })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Prize Purse (£)</label>
        <input
          type="number"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
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
        <label className="text-gray-300">Allow Purchase of Extra T-Shirts</label>
      </div>
    </div>
  );
};

export default FinancialTab;
