'use client';

import { Settings as SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CompetitionPortalLayout from '@/components/layout/CompetitionPortalLayout';
import {
  BasicTab,
  DivisionsTab,
  EventsTab,
  WeightsTab,
  AthleteTab,
  RosterTab,
  CommunicationTab,
  RulesTab,
  LegalTab,
  FinancialTab,
  BrandingTab,
  SponsorshipTab,
} from '@/components/competition/settings';
import DeleteTab from '@/components/competition/settings/DeleteTab';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/components/context/AuthContext';
import { useDirtyTracker } from '@/hooks/useDirtyTracker';
import { logSystemEvent } from '@/lib/logSystemEvent';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { markDirty, resetDirty, isDirty } = useDirtyTracker();
  const [hashTab, setHashTab] = useState('Basic');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [competition, setCompetition] = useState<any>({
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
    divisions: [],
    scoringSystem: '',
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
    directMessagingEnabled: false,
    groupMessagingEnabled: false,
    divisionMessagingEnabled: false,
    pinnedNotice: '',
    mcAnnouncements: '',
    organizerEmail: '',
    organizerPhone: '',
    autoReplyMessage: '',
    attachments: [],
    settings: {
      basic: {},
      athlete: {},
      divisions: [],
      events: [],
      rules: {},
      legal: {},
      branding: {},
      financial: {},
      sponsorship: {},
    },
  });

  useEffect(() => {
    const updateTab = () => {
      const rawHash = window.location.hash.replace('#', '');
      setHashTab(rawHash || 'Basic');
    };
    updateTab();
    window.addEventListener('hashchange', updateTab);
    return () => window.removeEventListener('hashchange', updateTab);
  }, []);

  useEffect(() => {
    const fetchCompetitionData = async () => {
      const compId = router.query.id as string;
      if (!compId) return;
      try {
        const docRef = doc(db, 'competitions', compId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompetition(prev => ({
            ...prev,
            ...data,
            startDate: data.startDate instanceof Timestamp
              ? data.startDate.toDate().toISOString().slice(0, 10)
              : data.startDate,
            endDate: data.endDate instanceof Timestamp
              ? data.endDate.toDate().toISOString().slice(0, 10)
              : data.endDate,
            settings: {
              ...prev.settings,
              ...(data.settings || {}),
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching competition data:', error);
      }
    };

    if (router.isReady) fetchCompetitionData();
  }, [router.isReady, router.query.id, hashTab]); // ✅ Added `hashTab`

  const addEvent = () => {
    setCompetition(prev => ({
      ...prev,
      events: [...prev.events, { name: '', scoring: 'Points' }],
    }));
    markDirty();
  };

  const removeEvent = (index: number) => {
    const updated = [...competition.events];
    updated.splice(index, 1);
    setCompetition({ ...competition, events: updated });
    markDirty();
  };

  const updateEvent = (index: number, field: string, value: any) => {
    const updated = [...competition.events];
    updated[index][field] = value;
    setCompetition({ ...competition, events: updated });
    markDirty();
  };

  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save settings.');
      return;
    }

    try {
      const compId = router.query.id as string;
      let attachmentUrls: string[] = [];

      if (competition.attachments?.length) {
        const uploadPromises = competition.attachments.map(async (file: any) => {
          const fileRef = ref(storage, `messageAttachments/${compId}/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        attachmentUrls = await Promise.all(uploadPromises);
      }

      const startDateTimestamp = competition.startDate
        ? Timestamp.fromDate(new Date(competition.startDate))
        : null;
      const endDateTimestamp = competition.endDate
        ? Timestamp.fromDate(new Date(competition.endDate))
        : null;

      if (competition.startDate && isNaN(new Date(competition.startDate).getTime())) {
        alert('Please enter a valid start date.');
        return;
      }

      let status = 'active';
      if (endDateTimestamp) {
        const eventEndDate = endDateTimestamp.toDate();
        const eventEndPlusOne = new Date(eventEndDate);
        eventEndPlusOne.setDate(eventEndPlusOne.getDate() + 1);
        if (new Date() >= eventEndPlusOne) status = 'completed';
      }

      const competitionData = {
        ...competition,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
        status,
        attachments: attachmentUrls,
        organizerId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      delete competitionData.imageFile;

      await setDoc(doc(db, 'competitions', compId), competitionData, { merge: true });

      await logSystemEvent({
        action: 'Competition Settings Updated',
        performedBy: user.uid,
        competitionId: compId,
        details: `Competition settings updated for "${competition.name}"`,
      });

      alert('Settings saved successfully!');
      resetDirty();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please check for missing or invalid fields.');
    }
  };

  const handleConfirmSave = async () => {
    await handleSave();
    resetDirty();
    if (pendingTab) {
      router.push(`${router.pathname}#${pendingTab}`);
      setPendingTab(null);
    }
    setShowModal(false);
  };

  const handleDiscard = () => {
    resetDirty();
    if (pendingTab) {
      router.push(`${router.pathname}#${pendingTab}`);
      setPendingTab(null);
    }
    setShowModal(false);
  };

  return (
    <CompetitionPortalLayout
      competitionId={router.query.id as string}
      activeTab="Settings"
      isDirty={isDirty}
      setPendingTab={setPendingTab}
      setShowModal={setShowModal}
      handleSave={handleSave}
    >
      <div className="p-6 text-white max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-[#00FF00] mb-4 mt-1.5">
          <SettingsIcon size={24} />
          <h2 className="text-2xl">Settings</h2>
        </div>

        <div className="bg-[#111] p-6 rounded-lg shadow-lg border border-[#1a1a1a]">
          {hashTab === 'Basic' && <BasicTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Divisions' && <DivisionsTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Events' && <EventsTab competition={competition} setCompetition={setCompetition} addEvent={addEvent} removeEvent={removeEvent} updateEvent={updateEvent} markDirty={markDirty} />}
          {hashTab === 'Weights' && <WeightsTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Athlete' && <AthleteTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Roster' && <RosterTab competitionId={router.query.id as string} markDirty={markDirty} />}
          {hashTab === 'Communication' && <CommunicationTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Rules' && <RulesTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Legal' && <LegalTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Financial' && <FinancialTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Branding' && <BrandingTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Sponsorship' && <SponsorshipTab competition={competition} setCompetition={setCompetition} markDirty={markDirty} />}
          {hashTab === 'Delete' && <DeleteTab competition={competition} />}
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
    </CompetitionPortalLayout>
  );
}









