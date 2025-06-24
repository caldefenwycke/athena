// components/dashboard/competition/settings/tabs/SponsorshipTab.tsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface SponsorshipTabProps {
  competition: {
    sponsorName: string;
    sponsorLogo: string;
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

const SponsorshipTab: React.FC<SponsorshipTabProps> = ({ competition, setCompetition }) => {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `sponsorLogos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setCompetition((prev: any) => ({
        ...prev,
        sponsorLogo: downloadURL,
      }));
    } catch (error) {
      console.error('Error uploading sponsor logo:', error);
      alert('Logo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-1 text-sm text-gray-400">Sponsor Name</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.sponsorName}
          onChange={(e) =>
            setCompetition((prev: any) => ({ ...prev, sponsorName: e.target.value }))
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Sponsor Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="text-sm text-gray-300"
        />
        {uploading && <p className="text-gray-400 mt-1">Uploading...</p>}
        {competition.sponsorLogo && (
          <img
            src={competition.sponsorLogo}
            alt="Sponsor Logo"
            className="mt-2 max-h-32 rounded border border-[#444]"
          />
        )}
      </div>
    </div>
  );
};

export default SponsorshipTab;
