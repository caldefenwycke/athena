import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const SponsorshipTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompetition({ ...competition, sponsorLogo: file.name });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Sponsor Name</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
          value={competition.sponsorName}
          onChange={(e) =>
            setCompetition({ ...competition, sponsorName: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Upload Sponsor Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
        />
        {competition.sponsorLogo && (
          <p className="text-sm text-gray-500 mt-2">Selected: {competition.sponsorLogo}</p>
        )}
      </div>
    </div>
  );
};

export default SponsorshipTab;
