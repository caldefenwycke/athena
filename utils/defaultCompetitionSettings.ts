const defaultCompetitionSettings = {
  settings: {
    basic: {
      name: '',
      startDate: '',
      endDate: '',
      location: '',
      organiserName: '',
      organiserEmail: '',
      organiserPhone: '',
    },
    branding: {
      imageUrl: '',
      imagePath: '',
    },
    athlete: {
      registrationCloseDate: '',
      maxAthletes: 0,
      allowTShirtSize: false,
      allowHeightWeight: false,
      divisions: [],
    },
    event: {
      gender: 'Mixed', // or 'Male' / 'Female'
      useWeightClasses: false,
      events: [],
    },
    rules: {
      sanctioningBody: '',
      tiebreakerRule: '',
      rulesDocUrl: '',
      customRules: '',
    },
    financial: {
      registrationCost: 0,
      prizePurse: '',
      extraShirtCost: 0,
      stripeProductId: '',
      stripePriceId: '',
    },
    legal: {
      waiverType: 'athena', // or 'custom'
      waiverUrl: '',
    },
    sponsorship: {
      sponsors: [],
    },
  },
  overview: {
    totalAthletes: 0,
    avgScore: 0,
    topHighlights: '',
    upcomingCount: 0,
  },
  communication: {
    enableGroupMessages: true,
    enableDMs: true,
    welcomeMessage: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default defaultCompetitionSettings;