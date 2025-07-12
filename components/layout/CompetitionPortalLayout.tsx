'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';
import Sidebar from '@/components/ui/CompetitionSidebar';
import AthenaModal from '@/components/ui/AthenaModal';

type CompetitionPortalLayoutProps = {
  children: React.ReactNode;
  competitionId: string;
  activeTab: string;
  isDirty?: boolean;
  setPendingTab?: (tab: string) => void;
  setShowModal?: (show: boolean) => void;
  handleSave?: () => Promise<void>;
};

export default function CompetitionPortalLayout({
  children,
  competitionId,
  activeTab,
  isDirty = false,
  setPendingTab,
  handleSave,
}: CompetitionPortalLayoutProps) {
  const router = useRouter();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [showModal, setShowInternalModal] = useState(false);

  const handleConfirm = async () => {
    try {
      if (handleSave) await handleSave();
      setShowInternalModal(false);
      if (pendingRoute) {
        router.push(pendingRoute);
        setPendingTab?.(null);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDiscard = () => {
    setShowInternalModal(false);
    if (pendingRoute) {
      router.push(pendingRoute);
      setPendingTab?.(null);
    }
  };

  return (
    <div className="flex h-full w-full">
      <aside className="w-[220px] border-r border-[#222] bg-black">
        <Sidebar
          competitionId={competitionId}
          activeTab={activeTab}
          isDirty={isDirty}
          setPendingTab={setPendingRoute}
          setShowModal={setShowInternalModal}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#111] text-white p-6 rounded-lg shadow-md w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-red-500">Unsaved Changes</h2>
              <button onClick={() => setShowInternalModal(false)}>✕</button>
            </div>
            <p className="text-sm mb-4">
              Would you like to save before switching tabs?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDiscard}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
              >
                Discard
              </button>
              <button
                onClick={handleConfirm}
                className="bg-[#00FF00] hover:bg-green-400 text-black font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowInternalModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




























