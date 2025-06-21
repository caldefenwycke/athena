import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const RulesTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompetition({ ...competition, rulesDoc: file.name });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Sanctioning Body</label>
        <select
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.sanctioningBody}
          onChange={(e) =>
            setCompetition({ ...competition, sanctioningBody: e.target.value })
          }
        >
          <option>Strongman Corp</option>
          <option>OSG</option>
          <option>USS</option>
          <option>Unsanctioned</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Tie Breaker Rule</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.tieBreakerRule}
          onChange={(e) =>
            setCompetition({ ...competition, tieBreakerRule: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Upload Rules Document</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
          onChange={handleFileChange}
        />
        {competition.rulesDoc && (
          <p className="text-sm text-gray-500 mt-2">Selected: {competition.rulesDoc}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Rules Generator</label>
        <input
          type="text"
          disabled
          placeholder="Coming Soon"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default RulesTab;
