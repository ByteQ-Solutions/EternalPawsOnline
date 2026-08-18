/**
 * Eternal Paws Platform - Core Domain Types & Models
 * Single Source of Truth for Master Story Schema, Trust Verification, and Editorial Taxonomy.
 * 
 * Requirements: ORIGINAL_REQUEST § R3, PROJECT.md § Interface Contracts
 */

// ============================================================================
// 1. Editorial Taxonomy & Enums
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

export type StoryPublicationStatus = 
  | 'draft' 
  | 'review' 
  | 'published' 
  | 'archived';

// ============================================================================
// 2. Location & Canine Details
// ============================================================================

export interface LocationInfo {
  city: string;
  stateOrProvince: string;
  country: string;
}

export interface DogDetails {
  name: string;
  breed: string;
  location: LocationInfo;
  age?: string;
  gender?: 'male' | 'female' | 'unknown';
}

// ============================================================================
// 3. Media & AI Disclosure Models
// ============================================================================

export interface AiDisclosure {
  isAiGenerated: boolean;
  aiToolUsed?: string;
  reconstructionRationale?: string;
}

export interface ImageMedia {
  url: string;
  altText: string;
  credit: string;
  licenseType: ImageLicenseType;
  width: number;
  height: number;
  aspectRatio: string; // e.g. "16:9", "3:2", "4:3", "1:1"
  aiDisclosure?: AiDisclosure;
}

export type HeroImage = ImageMedia;

// ============================================================================
// 4. Source Attribution & Fact-Checking Records
// ============================================================================

export interface SourceAttribution {
  id: string;
  name: string;
  type: SourceType;
  organization?: string;
  url?: string;
  documentReference?: string;
  verifiedDate: string; // ISO 8601 date string
  notes?: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt: string; // ISO 8601 timestamp
  verifiedBy: string;
  sources: SourceAttribution[];
  methodologyNotes: string;
  confidenceScore: number; // 0-100
}

export interface PublicTrustCardData {
  verification: VerificationRecord;
  storyTitle: string;
  storySlug: string;
  factCheckerName: string;
  methodologySummary: string;
  sources: SourceAttribution[];
  correctionUrl: string;
  factCheckingPolicyUrl: string;
}

// ============================================================================
// 5. Master Story Domain Model
// ============================================================================

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
  heroImage: ImageMedia;
  verification: VerificationRecord;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  status: StoryPublicationStatus;
  redirectHistory?: string[];
}

// ============================================================================
// 6. Reader Submissions, Corrections & Newsletter Models
// ============================================================================

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

export interface CorrectionRecord {
  id: string;
  storySlug: string;
  reportedDate: string;
  resolvedDate?: string;
  correctionType: 'factual_fix' | 'clarification' | 'attribution_update' | 'source_addition';
  description: string;
  status: 'Pending Review' | 'Under Investigation' | 'Resolved & Published' | 'Dismissed';
}

// ============================================================================
// 7. Search & Discovery Models
// ============================================================================

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

// ============================================================================
// 8. Monetization Ad Slot Models
// ============================================================================

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

// ============================================================================
// 9. Taxonomy Configuration Constants
// ============================================================================

export interface CategoryMetadataConfig {
  label: string;
  slug: StoryCategory;
  description: string;
  metaTitle: string;
  icon?: string;
}

export const CATEGORIES_CONFIG: Record<StoryCategory, CategoryMetadataConfig> = {
  'reunions': {
    label: 'Heartfelt Reunions',
    slug: 'reunions',
    description: 'Remarkable true stories of lost dogs making miraculous journeys back to their families.',
    metaTitle: 'Dog Reunions - True Miraculous Return Stories | Eternal Paws',
    icon: '🏠'
  },
  'hero-dogs': {
    label: 'Hero Dogs',
    slug: 'hero-dogs',
    description: 'Incredible accounts of canine bravery, search and rescue triumphs, and lives saved.',
    metaTitle: 'Hero Dogs - True Stories of Canine Bravery | Eternal Paws',
    icon: '🛡️'
  },
  'rescues': {
    label: 'Rescue & Recovery',
    slug: 'rescues',
    description: 'Inspiring transformations of neglected, injured, or abandoned dogs finding unconditional love.',
    metaTitle: 'Rescue Stories - True Canine Transformations | Eternal Paws',
    icon: '🐾'
  },
  'survival': {
    label: 'Against All Odds',
    slug: 'survival',
    description: 'True survival tales of dogs enduring natural disasters, harsh wilderness, and extreme peril.',
    metaTitle: 'Survival Dogs - True Stories of Resilience | Eternal Paws',
    icon: '🏔️'
  },
  'loyalty': {
    label: 'Unwavering Loyalty',
    slug: 'loyalty',
    description: 'Timeless testaments to the extraordinary bond, devotion, and lifelong fidelity of dogs.',
    metaTitle: 'Loyalty Stories - True Tales of Devotion | Eternal Paws',
    icon: '❤️'
  },
  'lost-and-found': {
    label: 'Lost & Found Journeys',
    slug: 'lost-and-found',
    description: 'Community-powered discoveries, microchip miracles, and reunions against impossible odds.',
    metaTitle: 'Lost & Found - True Stories of Found Dogs | Eternal Paws',
    icon: '🔍'
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

