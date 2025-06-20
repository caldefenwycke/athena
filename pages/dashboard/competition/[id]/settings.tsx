// pages/dashboard/competition/[id]/settings.tsx
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const tabLabels = [
  'Basic',
  'Branding',
  'Athlete',
  'Event',
  'Rules',
  'Financial',
  'Legal',
  'Sponsorship',
] as const;

type Tab = (typeof tabLabels)[number];

export default function CompetitionSettings() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<Tab>('Basic');

  const [competition, setCompetition] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    organiserName: '',
    organiserEmail: '',
    organiserPhone: '',
    image: '',
    rules: '',
    waivers: '',
  });

  useEffect(() => {
    if (id) {
      // TODO: Fetch competition details from Firestore
      console.log('Loaded competition ID:', id);
    }
  }, [id]);

  const handleSave = () => {
    // TODO: Save competition details to Firestore
    console.log('Saving competition:', id, competition);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Placeholder logic - Replace with actual upload handling (e.g. Firebase Storage)
      const imageUrl = URL.createObjectURL(file);
      setCompetition({ ...competition, image: imageUrl });
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Competition Settings</h1>
          <Link href="/dashboard/competition/my-competitions">
            <button className="bg-[#00FF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#00cc00]">
              ← Back
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabLabels.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold ${
                activeTab === tab
                  ? 'bg-[#00FF00] text-black'
                  : 'bg-[#222] text-white hover:bg-[#333]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4 text-white">
          {activeTab === 'Basic' && (
            <>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Competition Name</label>
                <input
                  value={competition.name}
                  onChange={(e) => setCompetition({ ...competition, name: e.target.value })}
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={competition.startDate}
                    onChange={(e) => setCompetition({ ...competition, startDate: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={competition.endDate}
                    onChange={(e) => setCompetition({ ...competition, endDate: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={competition.startTime}
                    onChange={(e) => setCompetition({ ...competition, startTime: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={competition.endTime}
                    onChange={(e) => setCompetition({ ...competition, endTime: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Location</label>
                <input
                  value={competition.location}
                  onChange={(e) => setCompetition({ ...competition, location: e.target.value })}
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Organiser Name</label>
                  <input
                    value={competition.organiserName}
                    onChange={(e) => setCompetition({ ...competition, organiserName: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={competition.organiserEmail}
                    onChange={(e) => setCompetition({ ...competition, organiserEmail: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={competition.organiserPhone}
                    onChange={(e) => setCompetition({ ...competition, organiserPhone: e.target.value })}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Branding' && (
            <>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Upload Competition Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white"
                />
              </div>
              {competition.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-1">Preview:</p>
                  <img
                    src={competition.image}
                    alt="Competition Preview"
                    className="rounded border border-[#333] max-h-64 object-contain"
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'Athlete' && <p>Coming soon: Athlete registration settings</p>}
          {activeTab === 'Event' && <p>Coming soon: Event setup</p>}
          {activeTab === 'Rules' && <p>Coming soon: Rules and sanctioning</p>}
          {activeTab === 'Financial' && <p>Coming soon: Financial settings</p>}
          {activeTab === 'Legal' && <p>Coming soon: Waiver and legal options</p>}
          {activeTab === 'Sponsorship' && <p>Coming soon: Sponsorship setup</p>}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-[#00FF00] text-black px-6 py-2 rounded font-semibold hover:bg-[#00cc00]"
        >
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}
