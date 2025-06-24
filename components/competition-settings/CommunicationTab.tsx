import React, { useRef } from 'react';

interface CommunicationTabProps {
  competition: {
    directMessagingEnabled: boolean;
    groupMessagingEnabled: boolean;
    divisionMessagingEnabled: boolean;
    pinnedNotice: string;
    mcAnnouncements: string;
    organizerEmail: string;
    organizerPhone: string;
    autoReplyMessage: string;
    attachments: File[];
  };
  setCompetition: React.Dispatch<React.SetStateAction<any>>;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ competition, setCompetition }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setCompetition({ ...competition, attachments: files });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Messaging Toggles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={competition.directMessagingEnabled}
            onChange={(e) =>
              setCompetition({ ...competition, directMessagingEnabled: e.target.checked })
            }
          />
          <label className="text-gray-300">Enable Direct Messaging</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={competition.groupMessagingEnabled}
            onChange={(e) =>
              setCompetition({ ...competition, groupMessagingEnabled: e.target.checked })
            }
          />
          <label className="text-gray-300">Enable Group Messaging</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={competition.divisionMessagingEnabled}
            onChange={(e) =>
              setCompetition({ ...competition, divisionMessagingEnabled: e.target.checked })
            }
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
          value={competition.organizerEmail}
          onChange={(e) =>
            setCompetition({ ...competition, organizerEmail: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Organizer Phone</label>
        <input
          type="tel"
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.organizerPhone}
          onChange={(e) =>
            setCompetition({ ...competition, organizerPhone: e.target.value })
          }
        />
      </div>

      {/* Messaging Content */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">Pinned Notice (Shown to All)</label>
        <textarea
          rows={3}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.pinnedNotice}
          onChange={(e) =>
            setCompetition({ ...competition, pinnedNotice: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">MC Announcements / Notes</label>
        <textarea
          rows={3}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.mcAnnouncements}
          onChange={(e) =>
            setCompetition({ ...competition, mcAnnouncements: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Auto-Reply Message for Athletes</label>
        <textarea
          rows={2}
          className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
          value={competition.autoReplyMessage}
          onChange={(e) =>
            setCompetition({ ...competition, autoReplyMessage: e.target.value })
          }
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
        {competition.attachments?.length > 0 && (
          <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
            {competition.attachments.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommunicationTab;
