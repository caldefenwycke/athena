'use client';

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { ScrollText } from 'lucide-react';

interface RulesTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const RulesTab: React.FC<RulesTabProps> = ({ competition, setCompetition, markDirty }) => {
  const router = useRouter();
  const { id } = router.query;
  const [uploading, setUploading] = useState(false);

  const rules = competition.settings?.rules || {};

  const updateRulesField = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        rules: {
          ...prev.settings.rules,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ Autosave on change
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      setUploading(true);
      const fileRef = ref(storage, `rulesDocs/${id}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      updateRulesField('rulesDoc', url); // This will also trigger markDirty()
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <ScrollText size={20} className="text-[#00FF00]" />
        Rules
      </h2>

      {/* Sanctioning Body */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Sanctioning Body</label>
        <select
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={rules.sanctioningBody || ''}
          onChange={(e) => updateRulesField('sanctioningBody', e.target.value)}
        >
          <option value="Unsanctioned">Unsanctioned</option>
          <option value="Strongman Corp">Strongman Corp</option>
          <option value="Giants Live">Giants Live</option>
          <option value="Official Strongman Games">Official Strongman Games</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {/* Tiebreaker Rule */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Tiebreaker Rule</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={rules.tieBreakerRule || ''}
          onChange={(e) => updateRulesField('tieBreakerRule', e.target.value)}
          placeholder="e.g. Fastest Time, Most Reps in Last Event"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Upload Rules Document (PDF)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-300"
        />
        {uploading && <p className="text-gray-400 text-sm mt-1">Uploading...</p>}
        {rules.rulesDoc && (
          <p className="text-green-400 text-sm mt-1">
            📄 <a href={rules.rulesDoc} target="_blank" rel="noopener noreferrer">View Uploaded Document</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default RulesTab;


