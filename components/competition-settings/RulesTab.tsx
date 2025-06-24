// components/dashboard/competition/settings/tabs/RulesTab.tsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface RulesTabProps {
  competition: {
    sanctioningBody: string;
    tieBreakerRule: string;
    rulesDoc: string;
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

const RulesTab: React.FC<RulesTabProps> = ({ competition, setCompetition }) => {
  const router = useRouter();
  const { id } = router.query;
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      setUploading(true);
      const fileRef = ref(storage, `rulesDocs/${id}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setCompetition({ ...competition, rulesDoc: url });
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Sanctioning Body</label>
        <select
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.sanctioningBody}
          onChange={(e) =>
            setCompetition({ ...competition, sanctioningBody: e.target.value })
          }
        >
          <option value="Unsanctioned">Unsanctioned</option>
          <option value="Strongman Corp">Strongman Corp</option>
          <option value="Giants Live">Giants Live</option>
          <option value="Official Strongman Games">Official Strongman Games</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Tiebreaker Rule</label>
        <input
          type="text"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.tieBreakerRule}
          onChange={(e) =>
            setCompetition({ ...competition, tieBreakerRule: e.target.value })
          }
          placeholder="e.g. Fastest Time, Most Reps in Last Event"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Upload Rules Document (PDF)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-300"
        />
        {uploading && <p className="text-gray-400 text-sm mt-1">Uploading...</p>}
        {competition.rulesDoc && (
          <p className="text-green-400 text-sm mt-1">
            📄 <a href={competition.rulesDoc} target="_blank" rel="noopener noreferrer">View Uploaded Document</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default RulesTab;
