// pages/dashboard/competition/[id]/settings.tsx
import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  BasicTab,
  BrandingTab,
  AthleteTab,
  EventTab,
  RulesTab,
  FinancialTab,
  LegalTab,
  SponsorshipTab
} from '@/components/competition-settings';

function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Basic');
  const [competition, setCompetition] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    registrationCloseDate: '',
    maxAthletes: 0,
    requireTshirtSize: false,
    requireWeightHeight: false,
    events: [],
    sanctioningBody: 'Unsanctioned',
    tieBreakerRule: '',
    rulesDoc: '',
    registrationCost: 0,
    prizePurse: 0,
    extraTshirtOption: false,
    waiverType: 'athena',
    customWaiver: '',
    useTemplateWaiver: false,
    sponsorName: '',
    sponsorLogo: ''
  });

  const addEvent = () => {
    setCompetition({
      ...competition,
      events: [...competition.events, { name: '', scoring: 'Points', divisions: [] }]
    });
  };

  const removeEvent = (index: number) => {
    const updated = [...competition.events];
    updated.splice(index, 1);
    setCompetition({ ...competition, events: updated });
  };

  const updateEvent = (index: number, field: string, value: any) => {
    const updated = [...competition.events];
    updated[index][field] = value;
    setCompetition({ ...competition, events: updated });
  };

  const addDivision = (eventIndex: number) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions.push({ name: '', weights: '' });
    setCompetition({ ...competition, events: updated });
  };

  const updateDivision = (eventIndex: number, divIndex: number, field: string, value: any) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions[divIndex][field] = value;
    setCompetition({ ...competition, events: updated });
  };

  const removeDivision = (eventIndex: number, divIndex: number) => {
    const updated = [...competition.events];
    updated[eventIndex].divisions.splice(divIndex, 1);
    setCompetition({ ...competition, events: updated });
  };

  const handleSave = () => {
    // TODO: Implement save logic (e.g., send to Firestore or API)
    console.log('Competition settings saved:', competition);
    alert('Settings saved!');
  };

  const tabProps = {
    competition,
    setCompetition,
    addEvent,
    removeEvent,
    updateEvent,
    addDivision,
    updateDivision,
    removeDivision
  };

  return (
    <DashboardLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Competition Settings</h2>
          <button
            onClick={() => router.push('/dashboard/competition/my-competitions')}
            className="bg-[#00FF00] text-black px-4 py-2 rounded hover:bg-[#00cc00] transition-all font-bold"
          >
            ← Back
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            'Basic', 'Branding', 'Athlete', 'Event',
            'Rules', 'Financial', 'Legal', 'Sponsorship'
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold transition-all duration-150 shadow-md ${
                activeTab === tab
                  ? 'bg-[#00FF00] text-black'
                  : 'bg-[#222] text-white hover:bg-[#333]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-[#111] p-6 rounded-lg shadow-lg border border-[#1a1a1a]">
          {activeTab === 'Basic' && <BasicTab {...tabProps} />}
          {activeTab === 'Branding' && <BrandingTab {...tabProps} />}
          {activeTab === 'Athlete' && <AthleteTab {...tabProps} />}
          {activeTab === 'Event' && <EventTab {...tabProps} />}
          {activeTab === 'Rules' && <RulesTab {...tabProps} />}
          {activeTab === 'Financial' && <FinancialTab {...tabProps} />}
          {activeTab === 'Legal' && <LegalTab {...tabProps} />}
          {activeTab === 'Sponsorship' && <SponsorshipTab {...tabProps} />}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-[#00FF00] text-black px-6 py-3 rounded font-bold hover:bg-[#00cc00] transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
