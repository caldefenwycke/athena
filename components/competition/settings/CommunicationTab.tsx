'use client';

import React, { useRef } from 'react';
import { MessageCircle } from 'lucide-react';

interface CommunicationTabProps {
  competition: any;
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
  markDirty: () => void;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({
  competition,
  setCompetition,
  markDirty,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const comms = competition.settings?.communication || {};

  const update = (field: string, value: any) => {
    setCompetition((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        communication: {
          ...prev.settings.communication,
          [field]: value,
        },
      },
    }));
    markDirty(); // ✅ mark dirty on all updates
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      update('attachments', files);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl p-6 text-white">
      <h2 className="text-2xl font-normal text-[#00FF00] flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-[#00FF00]" />
        Communication
      </h2>

      {/* Messaging Toggles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={comms.directMessagingEnabled || false}
            onChange={(e) => update('directMessagingEnabled', e.target.checked)}
          />
          <label className="text-gray-300">Enable Direct Messaging</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={comms.groupMessagingEnabled || false}
            onChange={(e) => update('groupMessagingEnabled', e.target.checked)}
          />
          <label className="text-gray-300">Enable Group Messaging</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={comms.divisionMessagingEnabled || false}
            onChange={(e) => update('divisionMessagingEnabled', e.target.checked)}
          />
          <label className="text-gray-300">Enable Division Messaging</label>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">Organizer Email</label>
        <input
          type="email"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={comms.organizerEmail || ''}
          onChange={(e) => update('organizerEmail', e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Organizer Phone</label>
        <input
          type="tel"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={comms.organizerPhone || ''}
          onChange={(e) => update('organizerPhone', e.target.value)}
        />
      </div>

      {/* Messaging Content */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">Pinned Notice (Shown to All)</label>
        <textarea
          rows={3}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={comms.pinnedNotice || ''}
          onChange={(e) => update('pinnedNotice', e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">MC Announcements / Notes</label>
        <textarea
          rows={3}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={comms.mcAnnouncements || ''}
          onChange={(e) => update('mcAnnouncements', e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Auto-Reply Message for Athletes</label>
        <textarea
          rows={2}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={comms.autoReplyMessage || ''}
          onChange={(e) => update('autoReplyMessage', e.target.value)}
        />
      </div>

      {/* File Attachment */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">Upload Message Attachments</label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="w-full text-white"
          onChange={handleFileUpload}
        />
        {comms.attachments?.length > 0 && (
          <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
            {comms.attachments.map((file: any, index: number) => (
              <li key={index}>{file.name || 'File uploaded'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommunicationTab;

