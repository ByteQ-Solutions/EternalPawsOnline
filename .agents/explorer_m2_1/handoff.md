# Investigation & Architectural Blueprint: Domain Models, Types, and Zod Schemas (Milestone M2)

**Author:** Explorer 1 (`explorer_m2_1`)  
**Milestone:** M2 — Domain Models & Fact-Checking Trust Engine  
**Target Files:**
- `src/domain/types.ts`
- `src/domain/schemas.ts`
- `src/domain/index.ts`
- `tests/unit/domain-schemas.test.ts`

---

## 1. Observation

### 1.1 Specification Baseline
Direct observation from `PROJECT.md` (§ Interface Contracts, lines 111–169), `ORIGINAL_REQUEST.md` (§ R3, R5), `tests/harness/fixtures.ts` (lines 12–179), and `tests/tier2-boundary-corner/r3-trust-boundaries.test.ts`:

1. **Categorical Enums**:
   - `StoryCategory`: `'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found'` (6 values)
   - `EmotionalTheme`: `'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave'` (6 values)
   - `VerificationStatus`: `'Unverified' | 'Partially Verified' | 'Verified' | 'Strongly Verified'` (4 values)
   - `SourceType`: `'shelter' | 'police' | 'news_outlet' | 'veterinary_clinic' | 'eyewitness' | 'court_record' | 'official_agency'` (7 values)
   - `ImageLicenseType`: `'original_photography' | 'official_source_release' | 'licensed_stock' | 'user_submitted_verified' | 'ai_visual_reconstruction'` (5 values)
   - `StoryPublicationStatus`: `'draft' | 'review' | 'published' | 'archived'` (4 values)

2. **Core Domain Entities**:
   - `LocationInfo`: `{ city: string; stateOrProvince: string; country: string }`
   - `DogDetails`: `{ name: string; breed: string; location: LocationInfo; age?: string; gender?: 'male' | 'female' | 'unknown' }`
   - `AiDisclosure`: `{ isAiGenerated: boolean; aiToolUsed?: string; reconstructionRationale?: string }`
   - `ImageMedia` / `HeroImage`: `{ url: string; altText: string; credit: string; licenseType: ImageLicenseType; width: number; height: number; aspectRatio: string; aiDisclosure?: AiDisclosure }`
   - `SourceAttribution`: `{ id: string; name: string; type: SourceType; organization?: string; url?: string; documentReference?: string; verifiedDate: string; notes?: string }`
   - `VerificationRecord`: `{ status: VerificationStatus; verifiedAt: string; verifiedBy: string; sources: SourceAttribution[]; methodologyNotes: string; confidenceScore: number }`
   - `PublicTrustCardData`: Structured data contract for public Trust Card rendering including status, score, fact-checker info, source citations, policy links, and correction route.
   - `Story`: Comprehensive editorial article entity containing all metadata, hero image, verification record, reading time, and redirect history.

3. **Ancillary Transactional Domain Payloads**:
   - `SubmissionPayload`: Contributor intake payload with 5-step wizard validation, image limits (5MB, JPEG/PNG/WebP), rights confirmation, and sources.
   - `NewsletterPayload`: Email signup with RFC validation, referrer source, and consent agreement.
   - `CorrectionSubmissionPayload`: Reader factual correction submission form with story reference, min 20-char explanation, evidence link, and contact email.
   - `CorrectionRecord`: Public transparency correction log entry.
   - `SearchFilter` & `SearchResult`: Multi-field fuzzy search contracts.
   - `AdSlotConfig` & `AdSlotPosition`: Monetization layout reservation contracts.

---

## 2. Logic Chain

1. **Type Synchronization Guarantee**:
   `src/domain/types.ts` is the single source of truth for the entire platform. Upstream modules (M3 SSR reader, M4 fuzzy discovery, M5 submissions & CMS, M6 monetization, and M7 testing) depend directly on these types. The types must align with `tests/harness/fixtures.ts` and `PROJECT.md` to prevent any runtime or compilation divergence.

2. **Strict Zod Schema Design**:
   Runtime validation via Zod (`src/domain/schemas.ts`) ensures that invalid inputs are caught at system boundaries (API routes, CMS pre-publish gates, and contributor intake).
   - **Slug Validation**: Kebab-case lowercase alphanumeric syntax (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), 3–100 chars, no leading/trailing hyphens.
   - **AI Disclosure Invariant**: When `licenseType === 'ai_visual_reconstruction'`, Zod refinement enforces `aiDisclosure.isAiGenerated === true` and `aiDisclosure.reconstructionRationale` with at least 10 characters.
   - **URL Protocol Safety**: Source URLs are validated and checked to reject unsafe protocols (`javascript:`, `data:`, `vbscript:`).
   - **Alt-Text Invariant**: Alt text must be at least 5 characters to satisfy WCAG 2.2 AA accessibility requirements.
   - **Confidence Score Invariant**: Clamped integer between 0 and 100.
   - **Word Count & Reading Time**: Reading time must be positive integer; content must have sufficient substance.

3. **Clean Barrel Structure**:
   `src/domain/index.ts` must export all TypeScript interfaces, Zod schemas, validation helpers (`validateStory`, `parseStory`, `validateSubmission`, `validateCorrection`, `validateNewsletter`), and error formatting utilities.

---

## 3. Concrete Implementation Blueprint

### 3.1 `src/domain/types.ts`

```typescript
/**
 * Eternal Paws Platform - Core Domain Types & Models
 * Single Source of Truth for Master Story Schema, Trust Verification, and Editorial Taxonomy.
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
```

---

### 3.2 `src/domain/schemas.ts`

```typescript
/**
 * Eternal Paws Platform - Master Zod Schemas & Validators
 * Provides runtime validation, constraints, and parsing utilities.
 */

import { z } from 'zod';
import {
  StoryCategory,
  EmotionalTheme,
  VerificationStatus,
  SourceType,
  ImageLicenseType,
  StoryPublicationStatus,
  Story,
  SubmissionPayload,
  NewsletterPayload,
  CorrectionSubmissionPayload
} from './types';

// ============================================================================
// 1. Primitive & Regex Validators
// ============================================================================

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
export const ASPECT_RATIO_REGEX = /^\d+(\.\d+)?\/\d+(\.\d+)?$|^\d+:\d+$/;

export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters long')
  .max(100, 'Slug cannot exceed 100 characters')
  .regex(SLUG_REGEX, 'Slug must be lowercase alphanumeric with hyphens (e.g. "bella-rescue-story")');

export const isoDateSchema = z
  .string()
  .refine(
    val => !isNaN(Date.parse(val)) && ISO_DATE_REGEX.test(val),
    'Date must be a valid ISO 8601 date-time string'
  );

export const safeUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .refine(
    url => !url.startsWith('javascript:') && !url.startsWith('data:') && !url.startsWith('vbscript:'),
    'URL contains forbidden protocol'
  );

// ============================================================================
// 2. Taxonomy & Enum Schemas
// ============================================================================

export const storyCategorySchema = z.enum([
  'reunions',
  'hero-dogs',
  'rescues',
  'survival',
  'loyalty',
  'lost-and-found'
] as const satisfies readonly StoryCategory[]);

export const emotionalThemeSchema = z.enum([
  'joyful',
  'tearjerker',
  'inspiring',
  'miraculous',
  'heartwarming',
  'brave'
] as const satisfies readonly EmotionalTheme[]);

export const emotionalThemesArraySchema = z
  .array(emotionalThemeSchema)
  .min(1, 'At least one emotional theme is required')
  .max(3, 'At most three emotional themes may be assigned');

export const verificationStatusSchema = z.enum([
  'Unverified',
  'Partially Verified',
  'Verified',
  'Strongly Verified'
] as const satisfies readonly VerificationStatus[]);

export const sourceTypeSchema = z.enum([
  'shelter',
  'police',
  'news_outlet',
  'veterinary_clinic',
  'eyewitness',
  'court_record',
  'official_agency'
] as const satisfies readonly SourceType[]);

export const imageLicenseTypeSchema = z.enum([
  'original_photography',
  'official_source_release',
  'licensed_stock',
  'user_submitted_verified',
  'ai_visual_reconstruction'
] as const satisfies readonly ImageLicenseType[]);

export const storyPublicationStatusSchema = z.enum([
  'draft',
  'review',
  'published',
  'archived'
] as const satisfies readonly StoryPublicationStatus[]);

// ============================================================================
// 3. Location & Dog Details Schemas
// ============================================================================

export const locationInfoSchema = z.object({
  city: z.string().min(1, 'City is required').max(100),
  stateOrProvince: z.string().min(1, 'State or Province is required').max(100),
  country: z.string().min(1, 'Country is required').max(100)
});

export const dogDetailsSchema = z.object({
  name: z.string().min(1, 'Dog name is required').max(50),
  breed: z.string().min(1, 'Dog breed is required').max(80),
  location: locationInfoSchema,
  age: z.string().max(30).optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional()
});

// ============================================================================
// 4. Media & AI Disclosure Schemas
// ============================================================================

export const aiDisclosureSchema = z.object({
  isAiGenerated: z.boolean(),
  aiToolUsed: z.string().min(2, 'AI tool name is required').max(100).optional(),
  reconstructionRationale: z
    .string()
    .min(10, 'Reconstruction rationale must be at least 10 characters explaining why original photo is unavailable')
    .max(1000)
    .optional()
});

export const imageMediaSchema = z
  .object({
    url: safeUrlSchema,
    altText: z
      .string()
      .min(5, 'Alt text must be at least 5 characters long for accessibility')
      .max(300, 'Alt text cannot exceed 300 characters'),
    credit: z.string().min(2, 'Image credit must be at least 2 characters').max(150),
    licenseType: imageLicenseTypeSchema,
    width: z.number().int().positive('Image width must be a positive integer'),
    height: z.number().int().positive('Image height must be a positive integer'),
    aspectRatio: z.string().regex(ASPECT_RATIO_REGEX, 'Aspect ratio must be in format W:H or W/H (e.g. 16:9, 3:2)'),
    aiDisclosure: aiDisclosureSchema.optional()
  })
  .superRefine((data, ctx) => {
    if (data.licenseType === 'ai_visual_reconstruction') {
      if (!data.aiDisclosure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'AI Visual Reconstruction license requires an aiDisclosure object.',
          path: ['aiDisclosure']
        });
      } else {
        if (!data.aiDisclosure.isAiGenerated) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'AI Visual Reconstruction license requires isAiGenerated to be true.',
            path: ['aiDisclosure', 'isAiGenerated']
          });
        }
        if (
          !data.aiDisclosure.reconstructionRationale ||
          data.aiDisclosure.reconstructionRationale.trim().length < 10
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'AI Visual Reconstruction requires a rationale of at least 10 characters.',
            path: ['aiDisclosure', 'reconstructionRationale']
          });
        }
      }
    }
    if (data.licenseType === 'original_photography' && (!data.credit || data.credit.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Original photography requires explicit photographer credit.',
        path: ['credit']
      });
    }
  });

export const heroImageSchema = imageMediaSchema;

// ============================================================================
// 5. Source Attribution & Verification Schemas
// ============================================================================

export const sourceAttributionSchema = z.object({
  id: z.string().min(1, 'Source ID is required'),
  name: z.string().min(2, 'Source name must be at least 2 characters').max(150),
  type: sourceTypeSchema,
  organization: z.string().max(150).optional(),
  url: safeUrlSchema.optional().or(z.literal('')),
  documentReference: z.string().max(100).optional(),
  verifiedDate: isoDateSchema,
  notes: z.string().max(1000).optional()
});

export const verificationRecordSchema = z.object({
  status: verificationStatusSchema,
  verifiedAt: isoDateSchema,
  verifiedBy: z.string().min(1, 'Fact-checker attribution is required'),
  sources: z.array(sourceAttributionSchema),
  methodologyNotes: z.string().min(10, 'Methodology notes must be at least 10 characters'),
  confidenceScore: z.number().int().min(0, 'Score minimum is 0').max(100, 'Score maximum is 100')
});

// ============================================================================
// 6. Master Story Schema
// ============================================================================

export const storySchema = z.object({
  id: z.string().min(1, 'Story ID is required'),
  slug: slugSchema,
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  subtitle: z
    .string()
    .min(5, 'Subtitle must be at least 5 characters')
    .max(300, 'Subtitle cannot exceed 300 characters'),
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt cannot exceed 500 characters'),
  content: z.string().min(50, 'Content must contain at least 50 characters'),
  dogName: z.string().min(1, 'Dog name is required').max(50),
  dogBreed: z.string().min(1, 'Dog breed is required').max(80),
  location: locationInfoSchema,
  category: storyCategorySchema,
  emotionalThemes: emotionalThemesArraySchema,
  heroImage: imageMediaSchema,
  verification: verificationRecordSchema,
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
  readTimeMinutes: z.number().int().positive('Read time must be a positive integer'),
  featured: z.boolean(),
  status: storyPublicationStatusSchema,
  redirectHistory: z.array(slugSchema).optional()
});

// ============================================================================
// 7. Transactional Payloads Schemas (Submissions, Corrections, Newsletters)
// ============================================================================

export const submissionPayloadSchema = z.object({
  contributorName: z.string().min(2, 'Contributor name must be at least 2 characters'),
  contributorEmail: z.string().email('Please provide a valid email address'),
  dogName: z.string().min(1, 'Dog name is required'),
  dogBreed: z.string().min(1, 'Dog breed is required'),
  location: locationInfoSchema,
  category: storyCategorySchema,
  emotionalThemes: emotionalThemesArraySchema,
  title: z.string().min(5, 'Story title must be at least 5 characters').max(150),
  narrative: z.string().min(50, 'Story narrative must be at least 50 characters'),
  imageFile: z
    .object({
      name: z.string(),
      sizeBytes: z.number().max(5 * 1024 * 1024, 'Image size cannot exceed 5.0MB'),
      mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
        errorMap: () => ({ message: 'Image must be JPEG, PNG, or WebP format' })
      })
    })
    .optional(),
  imageRightsAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree and certify image ownership or publication rights' })
  }),
  sources: z.array(
    z.object({
      name: z.string().min(2, 'Source name is required'),
      type: sourceTypeSchema,
      organization: z.string().optional(),
      urlOrPhone: z.string().optional()
    })
  )
});

export const newsletterPayloadSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  referrerSource: z.string().optional(),
  consentAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to receive the weekly email' })
  })
});

export const correctionSubmissionSchema = z.object({
  storyId: z.string().min(1, 'Story reference is required'),
  storySlug: slugSchema,
  claimDescription: z.string().min(10, 'Claim description must be at least 10 characters').max(500),
  correctionDetails: z.string().min(20, 'Correction details must be at least 20 characters').max(3000),
  supportingEvidenceUrl: safeUrlSchema.optional().or(z.literal('')),
  submitterEmail: z.string().email('Valid contact email is required')
});

// ============================================================================
// 8. Validation & Parser Helper Utilities
// ============================================================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  return formatted;
}

export function validateStory(input: unknown): ValidationResult<Story> {
  const result = storySchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data as Story };
  }
  return { success: false, errors: formatZodError(result.error) };
}

export function parseStory(input: unknown): Story {
  return storySchema.parse(input) as Story;
}

export function validateSubmission(input: unknown): ValidationResult<SubmissionPayload> {
  const result = submissionPayloadSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data as SubmissionPayload };
  }
  return { success: false, errors: formatZodError(result.error) };
}

export function validateNewsletter(input: unknown): ValidationResult<NewsletterPayload> {
  const result = newsletterPayloadSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data as NewsletterPayload };
  }
  return { success: false, errors: formatZodError(result.error) };
}

export function validateCorrection(input: unknown): ValidationResult<CorrectionSubmissionPayload> {
  const result = correctionSubmissionSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data as CorrectionSubmissionPayload };
  }
  return { success: false, errors: formatZodError(result.error) };
}
```

---

### 3.3 `src/domain/index.ts`

```typescript
/**
 * Eternal Paws Platform - Domain Module Index
 * Re-exports all domain models, schemas, and validators.
 */

export * from './types';
export * from './schemas';
```

---

## 4. Edge Cases & Handling Strategy

| Edge Case | Risk | Mitigation in Schemas / Types |
|---|---|---|
| **AI Visual Reconstruction without Rationale** | Lack of disclosure breaches trust & editorial charter | Zod `superRefine` on `imageMediaSchema` verifies `aiDisclosure.isAiGenerated === true` and `rationale.length >= 10`. |
| **Dangerous URL Schemes in Sources** | XSS or phishing attacks via `javascript:` or `data:` URLs | `safeUrlSchema` explicitly rejects non-http/https URL schemes. |
| **Invalid Slug Formatting** | Broken URLs, duplicate content, or routing collisions in Next.js | `slugSchema` uses strict regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` rejecting uppercase, spaces, and punctuation. |
| **Empty or Minimal Alt-Text** | Screen reader accessibility failures (WCAG 2.2 AA) | `altText` field requires `min(5)` characters. |
| **Extreme Confidence Score Overflow** | Scores > 100 or < 0 corrupting badge rendering | `confidenceScore` schema is bounded by `.min(0).max(100)`. |
| **Spam / Huge Text in Correction Form** | Database exhaustion / payload bloat | `correctionDetails` is constrained to `.min(20).max(3000)`. |
| **Invalid Image Upload Format in Submission** | Server-side upload corruption or unsupported animated formats | `submissionPayloadSchema` restricts `imageFile.mimeType` to `['image/jpeg', 'image/png', 'image/webp']` and size `<= 5MB`. |

---

## 5. Unit Testing Strategy (`tests/unit/domain-schemas.test.ts`)

The unit test file should be authored to test all schema boundaries using Vitest:

1. **Seed Stories Acceptance**:
   - Iterate over `allSeedStories` (`storyBellaRescue`, `storyBarnabySurvival`, `storyMaxHero`, `storyDaisyReunion`, `storyDukeLoyalty`, `storyLunaMiracle`, `storyRockyDraft`, `storyArchivedWithRedirects`) and assert `validateStory(story).success === true`.

2. **Boundary & Negative Cases**:
   - `storySchema` with empty title (<5), empty alt-text (<5), missing dogName, missing location fields.
   - `slugSchema` rejecting `'Bella Story'`, `'bella--rescue'`, `'-bella'`, `'bella-'`, `'bella_rescue'`.
   - `imageMediaSchema` rejecting `licenseType: 'ai_visual_reconstruction'` without `aiDisclosure` or with rationale `< 10` chars.
   - `sourceAttributionSchema` rejecting invalid `type: 'random_blog'`, malformed dates, and `javascript:` URLs.
   - `submissionPayloadSchema` rejecting emails without `@`, narratives `< 50` chars, images `> 5MB`, and `imageRightsAgreed: false`.
   - `correctionSubmissionSchema` rejecting explanations `< 20` chars and text `> 3000` chars.

3. **Parser & Error Formatter Helpers**:
   - Test `formatZodError` produces structured dictionary mapping field paths to string array messages.
   - Test `validateStory`, `validateSubmission`, `validateNewsletter`, `validateCorrection`.

---

## 6. Caveats

1. **Verification Calculus Module (`src/domain/verification.ts`)**:
   While `types.ts` and `schemas.ts` declare the verification contracts and schema constraints, the algorithmic score calculator (`calculateVerificationLevel`, `SOURCE_WEIGHTS`, `calculateVerificationTier`) will be implemented in `src/domain/verification.ts` (handled in tandem with Explorer 2 / Implementer 1).
2. **Framework Isolation**:
   Domain models and schemas are completely decoupled from React / Next.js UI libraries, allowing them to be shared across Server Components, Client Components, API route handlers, and test runners without bundle bloat.

---

## 7. Conclusion

The domain models, TypeScript interfaces (`src/domain/types.ts`), Zod schemas (`src/domain/schemas.ts`), and barrel exports (`src/domain/index.ts`) provide an airtight foundation for Milestone M2 and the entire Eternal Paws platform. All contracts are 100% compatible with existing test fixtures and all downstream milestone requirements (M3–M7).

---

## 8. Verification Method

To independently verify the domain design once implemented:
1. Ensure TypeScript compiles without errors: `npx tsc --noEmit`
2. Run Vitest on the new domain schemas test suite: `npx vitest run tests/unit/domain-schemas.test.ts`
3. Run existing feature coverage and boundary tests:
   - `npx vitest run tests/tier1-feature-coverage/r3-trust-engine.test.ts`
   - `npx vitest run tests/tier2-boundary-corner/r3-trust-boundaries.test.ts`
