import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type EventType = {
  name: string;
  scoring: string;
};

export type DivisionType = {
  name: string;
  gender: string;
  usesWeightClasses: boolean;
  weightClasses?: string[];
};

export type WeightEntry = {
  divisionName: string;
  eventName: string;
  value: number | string;
  unit?: string;
};

export interface CreateCompetitionPayload {
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  imageUrl?: string;
  events: EventType[];
  divisions: DivisionType[];
  weights: WeightEntry[];
}

export async function createCompetition(payload: CreateCompetitionPayload, compId: string) {
  const baseData = {
    name: payload.name,
    location: payload.location,
    startDate: payload.startDate,
    endDate: payload.endDate,
    organizerId: payload.organizerId,
    organizerName: payload.organizerName,
    organizerEmail: payload.organizerEmail,
    imageUrl: payload.imageUrl || '',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    settings: {
      basic: {
        name: payload.name,
        location: payload.location,
        startDate: payload.startDate,
        endDate: payload.endDate,
        organizerEmail: payload.organizerEmail,
        organizerName: payload.organizerName,
        organizerPhone: '',
      },
      athlete: {
        maxAthletes: 100,
        registrationCloseDate: '',
        requireTshirtSize: true,
        requireWeightHeight: true,
      },
      communication: {
        directMessagingEnabled: false,
        groupMessagingEnabled: false,
        divisionMessagingEnabled: false,
        pinnedNotice: '',
        mcAnnouncements: '',
        autoReplyMessage: '',
        organizerEmail: payload.organizerEmail,
        organizerPhone: '',
        attachments: [],
      },
      branding: {
        sponsorLogo: '',
        sponsorName: '',
      },
      rules: {
        sanctioningBody: 'Unsanctioned',
        tieBreakerRule: '',
        rulesDoc: '',
        useTemplateWaiver: false,
      },
      legal: {
        waiverType: 'athena',
        customWaiver: '',
      },
      financial: {
        registrationCost: 0,
        prizePurse: 0,
        extraTshirtOption: false,
      },
      sponsorship: {
        sponsors: [],
      },
    },
  };

  const compRef = doc(db, 'competitions', compId);
  await setDoc(compRef, baseData);

  // Subcollections
  for (const event of payload.events) {
    const eventRef = doc(collection(compRef, 'events'));
    await setDoc(eventRef, event);
  }

  for (const division of payload.divisions) {
    const divRef = doc(collection(compRef, 'divisions'));
    await setDoc(divRef, division);
  }

  for (const weight of payload.weights) {
    const weightId = `${weight.divisionName}_${weight.eventName}`.replace(/\s+/g, '');
    const weightRef = doc(collection(compRef, 'weights'), weightId);
    await setDoc(weightRef, {
      value: weight.value,
      unit: weight.unit || 'kg',
    });
  }

  return compId;
}

