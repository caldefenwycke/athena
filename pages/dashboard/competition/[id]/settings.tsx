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
  SponsorshipTab,
} from '@/components/competition-settings';
import OverviewTab from '@/components/competition-settings/OverviewTab';
import RosterTab from '@/components/competition-settings/AthleteRosterTab';
import CommunicationTab from '@/components/competition-settings/CommunicationTab'; // ✅ Import fixed
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

type CompetitionType = {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  image: string;
  imageFile: File | null;
  registrationCloseDate: string;
  maxAthletes: number;
  requireTshirtSize: boolean;
  requireWeightHeight: boolean;
  events: any[];
  sanctioningBody: string;
  tieBreakerRule: string;
  rulesDoc: string;
  registrationCost: number;
  prizePurse: number;
  extraTshirtOption: boolean;
  waiverType: 'athena' | 'custom';
  customWaiver: string;
  useTemplateWaiver: boolean;
  sponsorName: string;
  sponsorLogo: string;

  // ✅ Add communication fields
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

function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Basic');

  const [competition, setCompetition] = useState<CompetitionType>({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    imageFile: null,
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
    sponsorLogo: '',

    // ✅ Initialize communication fields
    directMessagingEnabled: false,
    groupMessagingEnabled: false,
    divisionMessagingEnabled: false,
    pinnedNotice: '',
    mcAnnouncements: '',
    organizerEmail: '',
    organizerPhone: '',
    autoReplyMessage: '',
    attachments: [],
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

  // ✅ Updated handleSave with Firebase attachment logic
  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save settings.');
      return;
    }

    try {
      const compId = router.query.id as string;
      let imageUrl = competition.image;

      if (competition.imageFile) {
        const imageRef = ref(storage, `competitionImages/${compId}`);
        await uploadBytes(imageRef, competition.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      let attachmentUrls: string[] = [];
      if (competition.attachments && competition.attachments.length > 0) {
        const uploadPromises = competition.attachments.map(async (file) => {
          const fileRef = ref(storage, `messageAttachments/${compId}/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        attachmentUrls = await Promise.all(uploadPromises);
      }

      const competitionData = {
        ...competition,
        image: imageUrl,
        attachments: attachmentUrls,
        organizerId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      delete competitionData.imageFile;

      await setDoc(doc(db, 'competitions', compId), competitionData, { merge: true });

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
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
            'Rules', 'Financial', 'Legal', 'Sponsorship',
            'Overview', 'Roster', 'Communication'
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
          {activeTab === 'Basic' && <BasicTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Branding' && <BrandingTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Athlete' && <AthleteTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Event' && (
            <EventTab
              competition={competition}
              setCompetition={setCompetition}
              addEvent={addEvent}
              removeEvent={removeEvent}
              updateEvent={updateEvent}
              addDivision={addDivision}
              updateDivision={updateDivision}
              removeDivision={removeDivision}
            />
          )}
          {activeTab === 'Rules' && <RulesTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Financial' && <FinancialTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Legal' && <LegalTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Sponsorship' && <SponsorshipTab competition={competition} setCompetition={setCompetition} />}
          {activeTab === 'Overview' && <OverviewTab competition={competition} />}
          {activeTab === 'Roster' && <RosterTab competitionId={router.query.id as string} />}
          {activeTab === 'Communication' && <CommunicationTab competition={competition} setCompetition={setCompetition} />}
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
