'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CompetitionPortalLayout from '@/components/layouts/CompetitionPortalLayout';
import {
  OverviewTab,
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
} from '@/components/competition-settings';
import DeleteTab from '@/components/competition-settings/DeleteTab';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { logSystemEvent } from '@/lib/logSystemEvent';

function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [hashTab, setHashTab] = useState('Overview');

  useEffect(() => {
    const updateTab = () => {
      const rawHash = window.location.hash.replace('#', '');
      setHashTab(rawHash || 'Overview');
    };

    updateTab(); // Set initial on load
    window.addEventListener('hashchange', updateTab);
    return () => window.removeEventListener('hashchange', updateTab);
  }, []);

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
    divisions: [],
  });

  useEffect(() => {
    const fetchCompetitionData = async () => {
      const compId = router.query.id as string;
      if (!compId) return;

      try {
        const docRef = doc(db, 'competitions', compId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompetition((prev: any) => ({
            ...prev,
            ...data,
            startDate: data.startDate instanceof Timestamp ? data.startDate.toDate().toISOString().slice(0, 10) : data.startDate,
            endDate: data.endDate instanceof Timestamp ? data.endDate.toDate().toISOString().slice(0, 10) : data.endDate,
          }));
        }
      } catch (error) {
        console.error('Error fetching competition data:', error);
      }
    };

    if (router.isReady) {
      fetchCompetitionData();
    }
  }, [router.isReady, router.query.id]);

  const addEvent = () => {
    setCompetition({
      ...competition,
      events: [...competition.events, { name: '', scoring: 'Points' }],
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

  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save settings.');
      return;
    }

    try {
      const compId = router.query.id as string;

      let attachmentUrls: string[] = [];
      if (competition.attachments && competition.attachments.length > 0) {
        const uploadPromises = competition.attachments.map(async (file: any) => {
          const fileRef = ref(storage, `messageAttachments/${compId}/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        attachmentUrls = await Promise.all(uploadPromises);
      }

      let startDateTimestamp = null;
      if (competition.startDate && !isNaN(new Date(competition.startDate).getTime())) {
        startDateTimestamp = Timestamp.fromDate(new Date(competition.startDate));
      }

      let endDateTimestamp = null;
      if (competition.endDate && !isNaN(new Date(competition.endDate).getTime())) {
        endDateTimestamp = Timestamp.fromDate(new Date(competition.endDate));
      }

      if (!competition.name || !startDateTimestamp) {
        alert('Competition name and a valid start date are required before saving.');
        return;
      }

      const today = new Date();
      let status = 'active';
      if (endDateTimestamp) {
        const eventEndDate = endDateTimestamp.toDate();
        const eventEndPlusOne = new Date(eventEndDate);
        eventEndPlusOne.setDate(eventEndPlusOne.getDate() + 1);
        if (today >= eventEndPlusOne) {
          status = 'completed';
        }
      }

      const competitionData = {
        ...competition,
        name: competition.name,
        description: competition.location,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
        status: status,
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
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please check for missing or invalid fields.');
    }
  };

  return (
    <CompetitionPortalLayout>
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

        <div className="bg-[#111] p-6 rounded-lg shadow-lg border border-[#1a1a1a]">
          {hashTab === 'Overview' && <OverviewTab competition={competition} />}
          {hashTab === 'Basic' && <BasicTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Divisions' && <DivisionsTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Events' && (
            <EventsTab
              competition={competition}
              setCompetition={setCompetition}
              addEvent={addEvent}
              removeEvent={removeEvent}
              updateEvent={updateEvent}
            />
          )}
          {hashTab === 'Weights' && <WeightsTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Athlete' && <AthleteTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Roster' && <RosterTab competitionId={router.query.id as string} />}
          {hashTab === 'Communication' && <CommunicationTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Rules' && <RulesTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Legal' && <LegalTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Financial' && <FinancialTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Branding' && <BrandingTab competition={competition} setCompetition={setCompetition} />}
          {hashTab === 'Sponsorship' && <SponsorshipTab competition={competition} setCompetition={setCompetition} />}
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

export default SettingsPage;


