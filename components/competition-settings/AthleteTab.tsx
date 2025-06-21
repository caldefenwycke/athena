import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const AthleteTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Registration Close Date</label>
        <input
          type="date"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.registrationCloseDate}
          onChange={(e) =>
            setCompetition({ ...competition, registrationCloseDate: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Max Athlete Count</label>
        <input
          type="number"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.maxAthletes}
          onChange={(e) =>
            setCompetition({ ...competition, maxAthletes: parseInt(e.target.value || '0') })
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={competition.requireTshirtSize}
          onChange={(e) =>
            setCompetition({ ...competition, requireTshirtSize: e.target.checked })
          }
        />
        <label className="text-gray-300">Require T-Shirt Size from Athletes</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={competition.requireWeightHeight}
          onChange={(e) =>
            setCompetition({ ...competition, requireWeightHeight: e.target.checked })
          }
        />
        <label className="text-gray-300">Require Weight/Height from Athletes</label>
      </div>
    </div>
  );
};

export default AthleteTab;
