/**
 * Eternal Paws Platform - Master Zod Schemas & Validators
 * Provides runtime validation, constraints, and parsing utilities.
 * 
 * Requirements: ORIGINAL_REQUEST § R3, PROJECT.md F06
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
    url => {
      const lower = url.trim().toLowerCase();
      return (
        !lower.startsWith('javascript:') &&
        !lower.startsWith('data:') &&
        !lower.startsWith('vbscript:') &&
        !lower.startsWith('file:')
      );
    },
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
