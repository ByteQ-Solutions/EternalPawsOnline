/**
 * Eternal Paws Platform - Test Harness Fixtures
 * 
 * Authoritative seed datasets, domain models, mock source attributions,
 * invalid test payloads, taxonomy configurations, and design token fixtures.
 */

// ============================================================================
// Core Domain Types & Enums (PROJECT.md § Interface Contracts)
// ============================================================================

export type StoryCategory = 
  | 'reunions' 
  | 'hero-dogs' 
  | 'rescues' 
  | 'survival' 
  | 'loyalty' 
  | 'lost-and-found';

export type EmotionalTheme = 
  | 'joyful' 
  | 'tearjerker' 
  | 'inspiring' 
  | 'miraculous' 
  | 'heartwarming' 
  | 'brave';

export type VerificationStatus = 
  | 'Unverified' 
  | 'Partially Verified' 
  | 'Verified' 
  | 'Strongly Verified';

export type SourceType = 
  | 'shelter' 
  | 'police' 
  | 'news_outlet' 
  | 'veterinary_clinic' 
  | 'eyewitness' 
  | 'court_record' 
  | 'official_agency';

export type ImageLicenseType = 
  | 'original_photography' 
  | 'official_source_release' 
  | 'licensed_stock' 
  | 'user_submitted_verified' 
  | 'ai_visual_reconstruction';

export interface SourceAttribution {
  id: string;
  name: string;
  type: SourceType;
  organization?: string;
  url?: string;
  documentReference?: string;
  verifiedDate: string;
  notes?: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt: string;
  verifiedBy: string;
  sources: SourceAttribution[];
  methodologyNotes: string;
  confidenceScore: number; // 0-100
}

export interface HeroImage {
  url: string;
  altText: string;
  credit: string;
  licenseType: ImageLicenseType;
  width: number;
  height: number;
  aspectRatio: string;
  aiDisclosure?: {
    isAiGenerated: boolean;
    aiToolUsed?: string;
    reconstructionRationale?: string;
  };
}

export interface LocationInfo {
  city: string;
  stateOrProvince: string;
  country: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  dogName: string;
  dogBreed: string;
  location: LocationInfo;
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  heroImage: HeroImage;
  verification: VerificationRecord;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  status: 'draft' | 'review' | 'published' | 'archived';
  redirectHistory?: string[];
}

export interface SearchFilter {
  query?: string;
  category?: StoryCategory;
  emotionalTheme?: EmotionalTheme;
  dogBreed?: string;
  location?: string;
  verificationStatus?: VerificationStatus;
}

export interface SearchResult {
  story: Story;
  relevanceScore: number;
  matchedFields: string[];
}

export type AdSlotPosition = 'after_intro' | 'mid_article' | 'article_end' | 'sidebar';

export interface AdSlotConfig {
  slotId: string;
  position: AdSlotPosition;
  minHeightPx: number;
  minWidthPx: number;
  aspectRatioReservation: string;
  safeMarginTopPx: number;
  safeMarginBottomPx: number;
  ctaBufferPx: number;
}

export interface SubmissionPayload {
  contributorName: string;
  contributorEmail: string;
  dogName: string;
  dogBreed: string;
  location: LocationInfo;
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  title: string;
  narrative: string;
  imageFile?: {
    name: string;
    sizeBytes: number;
    mimeType: string;
  };
  imageRightsAgreed: boolean;
  sources: Array<{
    name: string;
    type: SourceType;
    organization?: string;
    urlOrPhone?: string;
  }>;
}

export interface NewsletterPayload {
  email: string;
  referrerSource?: string;
  consentAgreed: boolean;
}

export interface CorrectionSubmissionPayload {
  storyId: string;
  storySlug: string;
  claimDescription: string;
  correctionDetails: string;
  supportingEvidenceUrl?: string;
  submitterEmail: string;
}

// ============================================================================
// Taxonomy & Configuration Constants
// ============================================================================

export const CATEGORIES_CONFIG: Record<StoryCategory, { label: string; slug: string; description: string; metaTitle: string }> = {
  'reunions': {
    label: 'Heartfelt Reunions',
    slug: 'reunions',
    description: 'Remarkable true stories of lost dogs making miraculous journeys back to their families.',
    metaTitle: 'Dog Reunions - True Miraculous Return Stories | Eternal Paws'
  },
  'hero-dogs': {
    label: 'Hero Dogs',
    slug: 'hero-dogs',
    description: 'Incredible accounts of canine bravery, search and rescue triumphs, and lives saved.',
    metaTitle: 'Hero Dogs - True Stories of Canine Bravery | Eternal Paws'
  },
  'rescues': {
    label: 'Rescue & Recovery',
    slug: 'rescues',
    description: 'Inspiring transformations of neglected, injured, or abandoned dogs finding unconditional love.',
    metaTitle: 'Rescue Stories - True Canine Transformations | Eternal Paws'
  },
  'survival': {
    label: 'Against All Odds',
    slug: 'survival',
    description: 'True survival tales of dogs enduring natural disasters, harsh wilderness, and extreme peril.',
    metaTitle: 'Survival Dogs - True Stories of Resilience | Eternal Paws'
  },
  'loyalty': {
    label: 'Unwavering Loyalty',
    slug: 'loyalty',
    description: 'Timeless testaments to the extraordinary bond, devotion, and lifelong fidelity of dogs.',
    metaTitle: 'Loyalty Stories - True Tales of Devotion | Eternal Paws'
  },
  'lost-and-found': {
    label: 'Lost & Found Journeys',
    slug: 'lost-and-found',
    description: 'Community-powered discoveries, microchip miracles, and reunions against impossible odds.',
    metaTitle: 'Lost & Found - True Stories of Found Dogs | Eternal Paws'
  }
};

export const EMOTIONAL_THEMES_CONFIG: Record<EmotionalTheme, { label: string; icon: string; description: string }> = {
  'joyful': { label: 'Joyful', icon: '🐾', description: 'Uplifting celebrations of pure canine happiness' },
  'tearjerker': { label: 'Tearjerker', icon: '🥺', description: 'Deeply emotional stories that touch the soul' },
  'inspiring': { label: 'Inspiring', icon: '✨', description: 'Triumphs of hope, spirit, and perseverance' },
  'miraculous': { label: 'Miraculous', icon: '🌟', description: 'Unbelievable outcomes that defied all probability' },
  'heartwarming': { label: 'Heartwarming', icon: '❤️', description: 'Gentle tales of love, companionship, and comfort' },
  'brave': { label: 'Brave', icon: '🛡️', description: 'Acts of selfless courage and protection' }
};

export const MONETIZATION_SLOTS_CONFIG: Record<AdSlotPosition, AdSlotConfig> = {
  'after_intro': {
    slotId: 'ad-slot-after-intro',
    position: 'after_intro',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatioReservation: '300/250',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    ctaBufferPx: 48
  },
  'mid_article': {
    slotId: 'ad-slot-mid-article',
    position: 'mid_article',
    minHeightPx: 280,
    minWidthPx: 336,
    aspectRatioReservation: '336/280',
    safeMarginTopPx: 36,
    safeMarginBottomPx: 36,
    ctaBufferPx: 48
  },
  'article_end': {
    slotId: 'ad-slot-article-end',
    position: 'article_end',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatioReservation: '300/250',
    safeMarginTopPx: 40,
    safeMarginBottomPx: 40,
    ctaBufferPx: 48
  },
  'sidebar': {
    slotId: 'ad-slot-sidebar',
    position: 'sidebar',
    minHeightPx: 600,
    minWidthPx: 300,
    aspectRatioReservation: '300/600',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    ctaBufferPx: 48
  }
};

export const editorialTokensFixture = {
  colors: {
    canvas: '#FAF8F5',
    card: '#FFFFFF',
    cardMuted: '#F4F0EA',
    inkPrimary: '#1E1E1E',
    inkMuted: '#555555',
    inkSubtle: '#767676',
    forestPrimary: '#234E35',
    forestLight: '#EBF3ED',
    goldAccent: '#C97A1E',
    goldLight: '#FEF7EC',
    borderLight: '#E8E3DA',
  },
  typography: {
    fontSerif: 'var(--font-editorial-serif), Georgia, serif',
    fontSans: 'var(--font-editorial-sans), system-ui, sans-serif',
  },
  touchTargetMin: '44px',
  shadows: {
    soft: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
    elevated: '0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)',
  }
};

// ============================================================================
// Mock Source Attribution Records
// ============================================================================

export const shelterSourceRecord: SourceAttribution = {
  id: 'src-sh-001',
  name: 'Humane Society of Western Montana',
  type: 'shelter',
  organization: 'Humane Society of Western Montana (501c3)',
  url: 'https://www.montanahumane.org/records/bella-2024',
  documentReference: 'INTAKE-DOC-MT-2024-8841',
  verifiedDate: '2025-01-14T10:00:00Z',
  notes: 'Shelter intake logs and microchip scan records verified directly by editorial staff.'
};

export const veterinarySourceRecord: SourceAttribution = {
  id: 'src-vet-002',
  name: 'Dr. Sarah Jenkins, DVM',
  type: 'veterinary_clinic',
  organization: 'Cascade Mountain Veterinary Hospital',
  url: 'https://cascademountainvet.com/cases/barnaby-recovery',
  documentReference: 'VET-REC-2024-1109',
  verifiedDate: '2025-01-15T14:30:00Z',
  notes: 'Post-flood physical evaluation and hypothermia recovery treatment verified.'
};

export const policeSourceRecord: SourceAttribution = {
  id: 'src-pol-003',
  name: 'Pitkin County Sheriff Search & Rescue',
  type: 'police',
  organization: 'Pitkin County Sheriff Office',
  url: 'https://pitkinsheriff.com/press/2024-avalanche-rescue-max',
  documentReference: 'INCIDENT-REPORT-2024-SAR-772',
  verifiedDate: '2025-02-01T09:15:00Z',
  notes: 'Official press release and search log coordinates confirmed.'
};

export const officialAgencySourceRecord: SourceAttribution = {
  id: 'src-agency-004',
  name: 'National Park Service Ranger Station',
  type: 'official_agency',
  organization: 'US National Park Service',
  documentReference: 'NPS-INCIDENT-2024-9918',
  verifiedDate: '2025-02-05T11:00:00Z',
  notes: 'Ranger incident report and dispatch audio log verified.'
};

export const courtSourceRecord: SourceAttribution = {
  id: 'src-court-005',
  name: 'Pierce County Superior Court Records',
  type: 'court_record',
  organization: 'Washington State Judicial Information System',
  documentReference: 'CASE-NO-2024-CV-3391',
  verifiedDate: '2025-02-10T16:00:00Z',
  notes: 'Legal custody restoration and ownership affidavit verified on court docket.'
};

export const newsSourceRecord: SourceAttribution = {
  id: 'src-news-006',
  name: 'Denver Post Investigative Desk',
  type: 'news_outlet',
  organization: 'The Denver Post',
  url: 'https://www.denverpost.com/2024/11/max-avalanche-dog-hero',
  verifiedDate: '2025-02-02T13:00:00Z',
  notes: 'Independent journalistic verification and witness interviews published.'
};

export const eyewitnessSourceRecord: SourceAttribution = {
  id: 'src-eye-007',
  name: 'Arthur Pendelton (Trail Witness)',
  type: 'eyewitness',
  verifiedDate: '2025-02-12T15:45:00Z',
  notes: 'Recorded audio interview corroborating timeline of dog staying beside fallen hiker.'
};

// ============================================================================
// Master Story Seed Datasets (All Categories & Verification Tiers)
// ============================================================================

export const storyBellaRescue: Story = {
  id: 'story-bella-rescue-001',
  slug: 'bella-blind-beagle-sanctuary-journey',
  title: 'Bella\'s Journey: How a Blind Beagle Guided an Entire Mountain Shelter to Hope',
  subtitle: 'Found abandoned in the Bitterroot wilderness, Bella taught a town what resilience looks like.',
  excerpt: 'Left behind in the rugged Bitterroot mountains, 8-year-old blind beagle Bella not only survived two weeks on instinct alone, but led rescuers directly to her hidden litter.',
  content: `On a freezing November morning in the Bitterroot Mountains of Montana, volunteer hikers spotted what appeared to be a small animal nestled beneath a fallen ponderosa pine. It was Bella, an eight-year-old lemon-and-white Beagle who had completely lost her eyesight due to untreated cataracts.

Despite total blindness, Bella had used her extraordinary sense of scent to locate freshwater springs and shelter from nightly snowfall. When rescue volunteers from the Humane Society of Western Montana approached, Bella did not growl or flee. Instead, she let out a gentle bay and carefully guided volunteers twenty yards uphill to a hollowed cedar trunk—where three newborn puppies were warm, dry, and nursing.

Veterinary staff at Cascade Mountain Veterinary Hospital reported that Bella had sustained minor frostbite on her paw pads but had shielded her puppies from the elements with her own body. Today, all four dogs have been adopted into loving homes across western Montana, and Bella serves as an official therapy ambassador at local pediatric rehabilitation centers.`,
  dogName: 'Bella',
  dogBreed: 'Beagle',
  location: {
    city: 'Missoula',
    stateOrProvince: 'Montana',
    country: 'United States'
  },
  category: 'rescues',
  emotionalThemes: ['inspiring', 'heartwarming', 'miraculous'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/bella-beagle-hero.webp',
    altText: 'Bella the blind lemon Beagle resting peacefully on a warm blanket surrounded by rescue volunteers in Montana',
    credit: 'Montana Humane Society / Mark Peterson Photography',
    licenseType: 'official_source_release',
    width: 1200,
    height: 675,
    aspectRatio: '16:9'
  },
  verification: {
    status: 'Strongly Verified',
    verifiedAt: '2025-01-16T12:00:00Z',
    verifiedBy: 'Elena Rostova, Senior Fact Checker',
    sources: [shelterSourceRecord, veterinarySourceRecord],
    methodologyNotes: 'Intake documentation, microchip telemetry, and veterinary hospital records independently inspected and confirmed.',
    confidenceScore: 95
  },
  publishedAt: '2025-01-20T08:00:00Z',
  updatedAt: '2025-01-20T08:00:00Z',
  readTimeMinutes: 4,
  featured: true,
  status: 'published',
  redirectHistory: []
};

export const storyBarnabySurvival: Story = {
  id: 'story-barnaby-survival-002',
  slug: 'barnaby-golden-retriever-flood-survival',
  title: 'Barnaby: The Golden Retriever Who Swam Two Miles in Floodwaters to Save His Family',
  subtitle: 'When raging river currents overtook their valley home, Barnaby became an unsinkable lifeline.',
  excerpt: 'Separated during a flash flood in North Carolina, Barnaby navigated swirling flood debris over two miles to lead emergency boat crews directly to his stranded family on their rooftop.',
  content: `When torrential rains triggered catastrophic flash floods across western North Carolina, the Henderson family found themselves trapped on their rising roof as floodwaters engulfed the valley below. In the chaos of the initial deluge, their seven-year-old Golden Retriever, Barnaby, was swept downstream by violent currents.

Rather than succumbing to exhaustion, Barnaby fought the rapids for over two miles, eventually hauling himself onto the high bank near a regional emergency staging area. Refusing to rest or take food offered by first responders, Barnaby barked persistently toward the swollen river and paced the shoreline until Swift Water Rescue teams followed his lead in an inflatable zodiac.

Barnaby guided the rescue boat through treacherous submerged obstacles, straight back to the rooftop where four family members were awaiting evacuation with only minutes of dry roof remaining. First responders officially credited Barnaby\'s navigational instincts with saving four lives.`,
  dogName: 'Barnaby',
  dogBreed: 'Golden Retriever',
  location: {
    city: 'Asheville',
    stateOrProvince: 'North Carolina',
    country: 'United States'
  },
  category: 'survival',
  emotionalThemes: ['brave', 'miraculous', 'inspiring'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/barnaby-golden-hero.webp',
    altText: 'Barnaby the Golden Retriever sitting proudly with the Swift Water Rescue team beside an emergency boat',
    credit: 'Western NC First Responders Public Information Office',
    licenseType: 'official_source_release',
    width: 1200,
    height: 800,
    aspectRatio: '3:2'
  },
  verification: {
    status: 'Strongly Verified',
    verifiedAt: '2025-01-18T16:00:00Z',
    verifiedBy: 'Marcus Vance, Investigative Editor',
    sources: [policeSourceRecord, veterinarySourceRecord, newsSourceRecord],
    methodologyNotes: 'Swift water rescue dispatch logs, police incident report, and regional news footage cross-referenced.',
    confidenceScore: 98
  },
  publishedAt: '2025-01-22T09:30:00Z',
  updatedAt: '2025-01-22T09:30:00Z',
  readTimeMinutes: 5,
  featured: true,
  status: 'published',
  redirectHistory: []
};

export const storyMaxHero: Story = {
  id: 'story-max-hero-003',
  slug: 'max-avalanche-search-dog-aspen',
  title: 'Max: The Avalanche Search Dog Who Dug Through Six Feet of Snow to Save Three Hikers',
  subtitle: 'A high-altitude search in Aspen turned miraculous when a Belgian Malinois refused to stop digging.',
  excerpt: 'Deployed after a sudden backcountry avalanche in Aspen, Malinois search dog Max pinpointed a buried snow pocket in sub-zero blizzard conditions, rescuing three trapped backcountry skiers.',
  content: `In the rugged backcountry peaks near Aspen, Colorado, a sudden Category 3 avalanche trapped a group of three backcountry skiers beneath several feet of dense, packed snow. With blizzard winds dropping visibility to near zero and temperatures plunging to minus fifteen degrees, standard transceiver signals were obscured by mineral-rich rock outcroppings.

Pitkin County Sheriff Search and Rescue deployed Max, a five-year-old Belgian Malinois certified in high-altitude avalanche detection. Working in twenty-minute shifts to prevent lung frostbite, Max circled the debris field before suddenly locking onto an unassuming snowbank and digging frantically.

Searchers followed Max\'s alert and uncovered an air pocket six feet beneath the surface where all three skiers were conscious and awaiting rescue. Max was awarded the Colorado State Canine Lifesaving Medal for his heroic action.`,
  dogName: 'Max',
  dogBreed: 'Belgian Malinois',
  location: {
    city: 'Aspen',
    stateOrProvince: 'Colorado',
    country: 'United States'
  },
  category: 'hero-dogs',
  emotionalThemes: ['brave', 'inspiring'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/max-malinois-avalanche.webp',
    altText: 'Max the Belgian Malinois search dog wearing orange search harness against snowy Aspen peaks',
    credit: 'Pitkin County Sheriff SAR Division',
    licenseType: 'official_source_release',
    width: 1200,
    height: 675,
    aspectRatio: '16:9'
  },
  verification: {
    status: 'Strongly Verified',
    verifiedAt: '2025-02-03T11:00:00Z',
    verifiedBy: 'Elena Rostova, Senior Fact Checker',
    sources: [policeSourceRecord, officialAgencySourceRecord, newsSourceRecord],
    methodologyNotes: 'Sheriff department official incident report, dispatch logs, and hospital admission records corroborated.',
    confidenceScore: 99
  },
  publishedAt: '2025-02-05T07:45:00Z',
  updatedAt: '2025-02-05T07:45:00Z',
  readTimeMinutes: 2,
  featured: true,
  status: 'published',
  redirectHistory: []
};

export const storyDaisyReunion: Story = {
  id: 'story-daisy-reunion-004',
  slug: 'daisy-500-mile-reunion-microchip-miracle',
  title: 'Daisy\'s 500-Mile Journey Home: The Microchip Miracle Four Years Later',
  subtitle: 'A Jack Russell Terrier vanished from an Oregon farm in 2021—and turned up in San Francisco.',
  excerpt: 'Four years after vanishing from her family\'s farm in southern Oregon, Daisy was scanned at a San Francisco shelter, triggering an emotional reunion across state lines.',
  content: `In the summer of 2021, the Martinez family was heartbroken when their spirited three-year-old Jack Russell Terrier, Daisy, disappeared during a thunderstorm from their rural property in Medford, Oregon. Months of flyers, social media campaigns, and shelter visits yielded no clues.

Four years later in early 2025, a stray terrier was brought into San Francisco Animal Care & Control by a good Samaritan who found her wandering near Golden Gate Park. When intake officer Clara Wong performed a routine universal microchip scan, the registry matched an address 500 miles north in Oregon.

The Martinez family immediately drove nine hours through the night. The moment Daisy heard her owner call her childhood nickname, she sprinted across the shelter greeting room, confirming beyond any doubt that home is wherever love remembers you.`,
  dogName: 'Daisy',
  dogBreed: 'Jack Russell Terrier',
  location: {
    city: 'San Francisco',
    stateOrProvince: 'California',
    country: 'United States'
  },
  category: 'reunions',
  emotionalThemes: ['joyful', 'tearjerker', 'miraculous'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/daisy-reunion.webp',
    altText: 'Daisy the Jack Russell Terrier leaping joyfully into her owner\'s arms at the shelter',
    credit: 'San Francisco Animal Care & Control Media Office',
    licenseType: 'official_source_release',
    width: 1200,
    height: 800,
    aspectRatio: '3:2'
  },
  verification: {
    status: 'Verified',
    verifiedAt: '2025-02-11T14:20:00Z',
    verifiedBy: 'Marcus Vance, Investigative Editor',
    sources: [shelterSourceRecord, courtSourceRecord],
    methodologyNotes: 'Shelter microchip registration logs from 2021 and 2025 intake records verified against Oregon municipal dog licensing database.',
    confidenceScore: 88
  },
  publishedAt: '2025-02-12T10:00:00Z',
  updatedAt: '2025-02-12T10:00:00Z',
  readTimeMinutes: 3,
  featured: false,
  status: 'published',
  redirectHistory: []
};

export const storyDukeLoyalty: Story = {
  id: 'story-duke-loyalty-005',
  slug: 'duke-loyal-hound-appalachian-trail',
  title: 'Duke the Faithful: The Hound Who Kept Vigil on the Appalachian Trail',
  subtitle: 'When an elderly hiker injured his ankle on a remote ridge, Duke never left his side for three days.',
  excerpt: 'A Coonhound named Duke guarded his injured companion in dense Virginia woods, foraging berries and barking in rhythmic intervals until park rangers located them.',
  content: `Along an isolated segment of the Appalachian Trail in the Blue Ridge Mountains of Virginia, 72-year-old hiker Thomas Albright slipped on wet shale, fracturing his ankle and rendering him unable to walk. His loyal Black and Tan Coonhound, Duke, immediately positioned himself as guardian.

Over the course of seventy-two grueling hours without human contact, Duke curled beside Albright at night to share body heat against near-freezing mountain temperatures. During the day, Duke scouted perimeter trails, returning every fifteen minutes and barking distinct three-burst distress signals that eventually caught the attention of section hikers.

When rescue crews from Shenandoah National Park arrived on the fourth morning, Duke was exhausted but steadfast, gently resting his muzzle in his owner\'s lap as paramedics stabilized the fracture.`,
  dogName: 'Duke',
  dogBreed: 'Black and Tan Coonhound',
  location: {
    city: 'Luray',
    stateOrProvince: 'Virginia',
    country: 'United States'
  },
  category: 'loyalty',
  emotionalThemes: ['heartwarming', 'brave', 'inspiring'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/duke-coonhound.webp',
    altText: 'Duke the Coonhound resting his head on a hiking backpack in the Blue Ridge Mountains',
    credit: 'Thomas Albright Family Archive',
    licenseType: 'user_submitted_verified',
    width: 1200,
    height: 675,
    aspectRatio: '16:9'
  },
  verification: {
    status: 'Partially Verified',
    verifiedAt: '2025-02-14T09:00:00Z',
    verifiedBy: 'Elena Rostova, Senior Fact Checker',
    sources: [eyewitnessSourceRecord],
    methodologyNotes: 'Eyewitness testimony from hiker and attending paramedics recorded; awaiting full official ranger log archival copy.',
    confidenceScore: 55
  },
  publishedAt: '2025-02-14T11:00:00Z',
  updatedAt: '2025-02-14T11:00:00Z',
  readTimeMinutes: 4,
  featured: false,
  status: 'published',
  redirectHistory: []
};

export const storyLunaMiracle: Story = {
  id: 'story-luna-miracle-006',
  slug: 'luna-second-chance-prosthetic-pioneer',
  title: 'Luna\'s Second Chance: The Prosthetic Pioneer Pup Inspiring Children Worldwide',
  subtitle: 'Born without front limbs, Luna\'s custom 3D-printed wheels turned a rescue into an international movement.',
  excerpt: 'Rescued from an abandoned barn in Ohio, Luna the border collie mix received pioneering 3D-printed titanium prosthetics, allowing her to run freely and visit pediatric hospitals.',
  content: `Discovered in rural Ohio as an orphaned pup born with congenital limb difference, Luna faced insurmountable odds. Most conventional shelters were unequipped to provide the intensive physical rehabilitation required for a bilateral amputee canine.

However, a collaborative initiative between Ohio State Veterinary Bioengineering and a local rescue organization designed custom lightweight carbon-fiber and titanium prosthetic harnesses tailored specifically to Luna\'s biomechanics. Within six weeks of gentle hydrotherapy and positive reinforcement training, Luna was not only walking—she was sprinting across grass fields with effortless agility.

Today, Luna visits pediatric mobility clinics, demonstrating to children with limb differences that physical challenges do not define one\'s capacity for joy, mobility, and boundless adventure.`,
  dogName: 'Luna',
  dogBreed: 'Border Collie Mix',
  location: {
    city: 'Columbus',
    stateOrProvince: 'Ohio',
    country: 'United States'
  },
  category: 'rescues',
  emotionalThemes: ['inspiring', 'joyful', 'miraculous'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/luna-prosthetics-ai-reconstruct.webp',
    altText: 'AI visual reconstruction showing Luna the Border Collie mix running joyfully across a grassy field with custom carbon-fiber prosthetics',
    credit: 'Eternal Paws Editorial Lab (Midjourney v6 Reconstruction)',
    licenseType: 'ai_visual_reconstruction',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    aiDisclosure: {
      isAiGenerated: true,
      aiToolUsed: 'Midjourney v6 & Adobe Firefly Generative Fill',
      reconstructionRationale: 'Archival visual reconstruction created from verified veterinary blueprints and initial low-resolution video stills to depict Luna\'s early sprint training with dignity.'
    }
  },
  verification: {
    status: 'Verified',
    verifiedAt: '2025-02-15T15:00:00Z',
    verifiedBy: 'Marcus Vance, Investigative Editor',
    sources: [veterinarySourceRecord, newsSourceRecord],
    methodologyNotes: 'University veterinary clinical trial records and published engineering case report verified.',
    confidenceScore: 84
  },
  publishedAt: '2025-02-15T16:30:00Z',
  updatedAt: '2025-02-15T16:30:00Z',
  readTimeMinutes: 4,
  featured: false,
  status: 'published',
  redirectHistory: []
};

export const storyRockyDraft: Story = {
  id: 'story-rocky-draft-007',
  slug: 'rocky-draft-backyard-adventure',
  title: 'Rocky\'s Backyard Mystery',
  subtitle: 'A playful puppy who dug up an antique locket.',
  excerpt: 'A golden pup finds an heirloom buried for fifty years in an old garden.',
  content: 'Rocky is a curious six-month-old Labrador retriever who loves digging in the backyard. One sunny afternoon, he unearthed a small metallic box wrapped in oilcloth. Inside was a vintage locket belonging to the home\'s original 1950s occupants.',
  dogName: 'Rocky',
  dogBreed: 'Labrador Retriever',
  location: {
    city: 'Boulder',
    stateOrProvince: 'Colorado',
    country: 'United States'
  },
  category: 'lost-and-found',
  emotionalThemes: ['heartwarming'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/rocky-labrador.webp',
    altText: 'Rocky the golden labrador puppy with dirt on his nose',
    credit: 'Contributor Submission',
    licenseType: 'user_submitted_verified',
    width: 800,
    height: 600,
    aspectRatio: '4:3'
  },
  verification: {
    status: 'Unverified',
    verifiedAt: '2025-02-16T10:00:00Z',
    verifiedBy: 'Automated Ingestion Queue',
    sources: [],
    methodologyNotes: 'Pending editor review and source verification.',
    confidenceScore: 10
  },
  publishedAt: '2025-02-16T10:00:00Z',
  updatedAt: '2025-02-16T10:00:00Z',
  readTimeMinutes: 2,
  featured: false,
  status: 'draft',
  redirectHistory: []
};

export const storyArchivedWithRedirects: Story = {
  id: 'story-archived-008',
  slug: 'buster-lost-and-found-legacy',
  title: 'Buster\'s Long Road: A Tale of Community Search Efforts',
  subtitle: 'How an entire county mobilized to bring an elderly Basset Hound home.',
  excerpt: 'When Buster went missing during the county fair, over two hundred volunteers coordinated a GPS grid search.',
  content: `In rural Pennsylvania, Buster the ten-year-old Basset Hound slipped his collar during the annual county agricultural exposition. Given Buster\'s impaired hearing and arthritic hips, community organizers recognized the urgency of immediate mobilization.

Within four hours, a volunteer coordinator mapped out forty search grids using public trails and farmland access lanes. Over two hundred local residents joined on foot, on bicycles, and with all-terrain vehicles.

On the second evening, volunteer searchers located Buster resting peacefully under an abandoned covered bridge three miles from the fairgrounds. Local veterinary clinics provided hydration support before reuniting Buster with his overjoyed family.`,
  dogName: 'Buster',
  dogBreed: 'Basset Hound',
  location: {
    city: 'Lancaster',
    stateOrProvince: 'Pennsylvania',
    country: 'United States'
  },
  category: 'lost-and-found',
  emotionalThemes: ['heartwarming', 'joyful'],
  heroImage: {
    url: 'https://images.eternal-paws.org/stories/buster-basset.webp',
    altText: 'Buster the Basset Hound with long droopy ears sitting calmly on grass',
    credit: 'Lancaster Community Volunteer Desk',
    licenseType: 'licensed_stock',
    width: 1200,
    height: 800,
    aspectRatio: '3:2'
  },
  verification: {
    status: 'Verified',
    verifiedAt: '2025-01-10T11:00:00Z',
    verifiedBy: 'Marcus Vance, Investigative Editor',
    sources: [policeSourceRecord, shelterSourceRecord],
    methodologyNotes: 'County emergency dispatch records and local volunteer logs verified.',
    confidenceScore: 82
  },
  publishedAt: '2025-01-12T08:00:00Z',
  updatedAt: '2025-02-01T14:00:00Z',
  readTimeMinutes: 3,
  featured: false,
  status: 'archived',
  redirectHistory: ['buster-lost-in-lancaster', 'buster-county-search-2024']
};

export const allSeedStories: Story[] = [
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyDaisyReunion,
  storyDukeLoyalty,
  storyLunaMiracle,
  storyRockyDraft,
  storyArchivedWithRedirects
];

export const publishedSeedStories: Story[] = allSeedStories.filter(s => s.status === 'published');

// ============================================================================
// Invalid & Boundary Test Payloads (For Robust Testing)
// ============================================================================

export const invalidSubmissionPayloads = {
  missingEmail: {
    contributorName: 'Jane Doe',
    contributorEmail: '',
    dogName: 'Buddy',
    dogBreed: 'Labrador',
    location: { city: 'Denver', stateOrProvince: 'CO', country: 'USA' },
    category: 'rescues' as StoryCategory,
    emotionalThemes: ['inspiring' as EmotionalTheme],
    title: 'A Beautiful Rescue',
    narrative: 'This is a long story narrative with plenty of details about the rescue.',
    imageRightsAgreed: true,
    sources: []
  },
  invalidEmailFormat: {
    contributorName: 'Jane Doe',
    contributorEmail: 'jane.doe-at-domain.com',
    dogName: 'Buddy',
    dogBreed: 'Labrador',
    location: { city: 'Denver', stateOrProvince: 'CO', country: 'USA' },
    category: 'rescues' as StoryCategory,
    emotionalThemes: ['inspiring' as EmotionalTheme],
    title: 'A Beautiful Rescue',
    narrative: 'This is a long story narrative with plenty of details about the rescue.',
    imageRightsAgreed: true,
    sources: []
  },
  shortNarrative: {
    contributorName: 'John Smith',
    contributorEmail: 'john@example.com',
    dogName: 'Rex',
    dogBreed: 'German Shepherd',
    location: { city: 'Austin', stateOrProvince: 'TX', country: 'USA' },
    category: 'hero-dogs' as StoryCategory,
    emotionalThemes: ['brave' as EmotionalTheme],
    title: 'Hero Pup',
    narrative: 'Rex saved us. Too short.',
    imageRightsAgreed: true,
    sources: []
  },
  oversizedImage: {
    name: 'giant-photo.png',
    sizeBytes: 8 * 1024 * 1024, // 8MB (exceeds 5MB limit)
    mimeType: 'image/png'
  },
  invalidImageMimeType: {
    name: 'animation.gif',
    sizeBytes: 1.5 * 1024 * 1024,
    mimeType: 'image/gif' // Not in JPEG/PNG/WebP allowlist
  },
  missingRightsAgreement: {
    contributorName: 'Alice Springs',
    contributorEmail: 'alice@example.com',
    dogName: 'Pip',
    dogBreed: 'Terrier',
    location: { city: 'Portland', stateOrProvince: 'OR', country: 'USA' },
    category: 'reunions' as StoryCategory,
    emotionalThemes: ['joyful' as EmotionalTheme],
    title: 'Pip Reunited',
    narrative: 'Pip went missing and came back after two weeks of searching.',
    imageRightsAgreed: false,
    sources: []
  }
};

export const invalidStoryPayloads = {
  missingAltText: {
    ...storyBellaRescue,
    id: 'invalid-no-alt',
    heroImage: {
      ...storyBellaRescue.heroImage,
      altText: ''
    }
  },
  missingSources: {
    ...storyBarnabySurvival,
    id: 'invalid-no-sources',
    verification: {
      ...storyBarnabySurvival.verification,
      sources: []
    }
  },
  invalidSlugCharacters: {
    ...storyMaxHero,
    id: 'invalid-bad-slug',
    slug: 'Max_The Avalanche Dog & SAR #1!'
  },
  missingAiRationale: {
    ...storyLunaMiracle,
    id: 'invalid-ai-no-rationale',
    heroImage: {
      ...storyLunaMiracle.heroImage,
      licenseType: 'ai_visual_reconstruction' as ImageLicenseType,
      aiDisclosure: {
        isAiGenerated: true,
        aiToolUsed: 'Midjourney',
        reconstructionRationale: '' // Empty rationale
      }
    }
  }
};
