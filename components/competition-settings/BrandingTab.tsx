import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const BrandingTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // You may want to convert the file to a URL or upload it to storage later
      setCompetition({ ...competition, image: file.name });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Upload Competition Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
          onChange={handleFileChange}
        />
        {competition.image && (
          <p className="text-sm text-gray-500 mt-2">Selected: {competition.image}</p>
        )}
      </div>
    </div>
  );
};

export default BrandingTab;
