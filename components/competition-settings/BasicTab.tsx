import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const BasicTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Competition Name</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.name}
          onChange={(e) => setCompetition({ ...competition, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Location</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.location}
          onChange={(e) => setCompetition({ ...competition, location: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm text-gray-400">Start Date</label>
          <input
            type="date"
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
            value={competition.startDate}
            onChange={(e) => setCompetition({ ...competition, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-400">End Date</label>
          <input
            type="date"
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
            value={competition.endDate}
            onChange={(e) => setCompetition({ ...competition, endDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTab;
