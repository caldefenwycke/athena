import React from 'react';

interface TabProps {
  competition: any;
  setCompetition: (value: any) => void;
}

const LegalTab: React.FC<TabProps> = ({ competition, setCompetition }) => {
  const handleWaiverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompetition({ ...competition, customWaiver: file.name });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Waiver Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="radio"
              name="waiverType"
              value="athena"
              checked={competition.waiverType === 'athena'}
              onChange={() => setCompetition({ ...competition, waiverType: 'athena' })}
            />
            Use Athena Waiver
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="radio"
              name="waiverType"
              value="custom"
              checked={competition.waiverType === 'custom'}
              onChange={() => setCompetition({ ...competition, waiverType: 'custom' })}
            />
            Upload Custom Waiver
          </label>
        </div>
      </div>

      {competition.waiverType === 'custom' && (
        <div>
          <label className="block mb-1 text-sm text-gray-400">Upload Waiver PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleWaiverUpload}
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
          />
          {competition.customWaiver && (
            <p className="text-sm text-gray-500 mt-2">Selected: {competition.customWaiver}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={competition.useTemplateWaiver}
          onChange={(e) =>
            setCompetition({ ...competition, useTemplateWaiver: e.target.checked })
          }
        />
        <label className="text-gray-300">Use Template Waiver (Optional)</label>
      </div>
    </div>
  );
};

export default LegalTab;
