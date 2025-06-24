// components/dashboard/competition/settings/tabs/BrandingTab.tsx
import React from 'react';

interface BrandingTabProps {
  competition: {
    image: string;
    imageFile: File | null;
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

export default function BrandingTab({ competition, setCompetition }: BrandingTabProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompetition((prev: any) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Competition Image</label>
        {competition.image && (
          <img
            src={competition.image}
            alt="Preview"
            className="w-48 h-48 object-cover rounded border border-[#333] mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-white"
        />
      </div>
    </div>
  );
}
