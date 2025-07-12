'use client';

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Handshake } from 'lucide-react';

interface SponsorshipTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const SponsorshipTab: React.FC<SponsorshipTabProps> = ({
  competition,
  setCompetition,
  markDirty,
}) => {
  const [uploading, setUploading] = useState(false);
  const sponsorship = competition.settings?.sponsorship || {};

  const updateField = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        sponsorship: {
          ...prev.settings.sponsorship,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ autosave
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `sponsorLogos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updateField('sponsorLogo', downloadURL); // ✅ triggers markDirty
    } catch (error) {
      console.error('Error uploading sponsor logo:', error);
      alert('Logo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <Handshake size={20} className="text-[#00FF00]" />
        Sponsorship
      </h2>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Sponsor Name</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={sponsorship.sponsorName || ''}
          onChange={(e) => updateField('sponsorName', e.target.value)}
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
        {sponsorship.sponsorLogo && (
          <img
            src={sponsorship.sponsorLogo}
            alt="Sponsor Logo"
            className="mt-2 max-h-32 rounded border border-[#444]"
          />
        )}
      </div>
    </div>
  );
};

export default SponsorshipTab;


