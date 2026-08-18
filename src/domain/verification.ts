/**
 * Eternal Paws Platform - Deterministic 4-Tier Verification & Trust Calculus Engine
 * 
 * Implements the mathematical scoring algorithm, institutional confidence weighting,
 * source deduplication, URL protocol sanitization, auto-downgrade gates,
 * and comprehensive audit record generation for the platform's fact-checking system.
 * 
 * Requirements: ORIGINAL_REQUEST § R3, PROJECT.md F07, F08, F09
 */

import {
  SourceAttribution,
  SourceType,
  VerificationStatus,
  VerificationRecord
} from './types';

// ============================================================================
// 1. Source Weight Configuration & Taxonomy
// ============================================================================

export interface SourceWeightConfig {
  baseScore: number;
  isInstitutional: boolean;
  label: string;
  description: string;
}

export const SOURCE_WEIGHTS: Record<SourceType, SourceWeightConfig> = {
  police: {
    baseScore: 40,
    isInstitutional: true,
    label: 'Police / Law Enforcement',
    description: 'Official police department incident logs, search and rescue reports, or sworn dispatch records.'
  },
  court_record: {
    baseScore: 40,
    isInstitutional: true,
    label: 'Court / Judicial Record',
    description: 'Certified court records, legal custody restoration orders, or municipal ownership affidavits.'
  },
  official_agency: {
    baseScore: 35,
    isInstitutional: true,
    label: 'Official Government Agency',
    description: 'National Park Service, municipal animal control, or state emergency disaster management filings.'
  },
  veterinary_clinic: {
    baseScore: 35,
    isInstitutional: true,
    label: 'Veterinary Hospital / Clinic',
    description: 'Licensed DVM medical intake logs, surgical charts, telemetry logs, and microchip scan audits.'
  },
  shelter: {
    baseScore: 30,
    isInstitutional: true,
    label: 'Animal Shelter / Humane Society',
    description: '501(c)(3) rescue intake documentation, microchip registration transfers, and adoption dossiers.'
  },
  news_outlet: {
    baseScore: 25,
    isInstitutional: false,
    label: 'Journalistic News Outlet',
    description: 'Independent news reporting with named author attribution and verified editorial review.'
  },
  eyewitness: {
    baseScore: 15,
    isInstitutional: false,
    label: 'Direct Eyewitness',
    description: 'Firsthand sworn testimony, recorded audio interviews, or corroborated bystander statements.'
  }
};

export const DOCUMENT_REFERENCE_BOOST = 10;
export const URL_VERIFICATION_BOOST = 5;

// ============================================================================
// 2. Calculus Interfaces
// ============================================================================

export interface VerificationCalculusResult {
  status: VerificationStatus;
  confidenceScore: number; // Clamped between 0 and 100
  institutionalCount: number;
  communityCount: number;
  totalSources: number;
  uniqueSourcesCount: number;
  deduplicatedSources: SourceAttribution[];
  scoreBreakdown: {
    baseScoreSum: number;
    docBoostSum: number;
    urlBoostSum: number;
    rawScore: number;
    clampedScore: number;
  };
  autoDowngradesApplied: string[];
  reason: string;
}

export interface VerificationOptions {
  activeDisputeFlag?: boolean;
  customMethodology?: string;
  auditorName?: string;
}

// ============================================================================
// 3. Helper Functions: Sanitization, Classification & Deduplication
// ============================================================================

/**
 * Validates and sanitizes source URLs, strictly rejecting dangerous URI schemes.
 * Returns valid http/https URLs as normalized strings, or null if invalid or unsafe.
 */
export function sanitizeSourceUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.length === 0) return null;

  // Reject malicious or unsafe schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns whether a given source type is classified as an institutional authority.
 */
export function isInstitutionalSource(type: SourceType): boolean {
  return SOURCE_WEIGHTS[type]?.isInstitutional ?? false;
}

/**
 * Retrieves the base score and institutional flag for a given source type.
 */
export function getSourceWeight(type: SourceType): { baseScore: number; isInstitutional: boolean } {
  const config = SOURCE_WEIGHTS[type];
  if (!config) {
    return { baseScore: 10, isInstitutional: false };
  }
  return { baseScore: config.baseScore, isInstitutional: config.isInstitutional };
}

/**
 * Deduplicates sources based on normalized URL or (name + type) composite key.
 */
export function deduplicateSources(sources: SourceAttribution[]): SourceAttribution[] {
  if (!sources || sources.length === 0) return [];
  const seenKeys = new Set<string>();
  const unique: SourceAttribution[] = [];

  for (const src of sources) {
    const sanitizedUrl = sanitizeSourceUrl(src.url);
    const key = sanitizedUrl ? `url:${sanitizedUrl}` : `entity:${src.name.trim().toLowerCase()}:${src.type}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      unique.push({
        ...src,
        url: sanitizedUrl || undefined
      });
    }
  }

  return unique;
}

// ============================================================================
// 4. Core Verification Calculus Engine
// ============================================================================

/**
 * Full-fidelity verification calculus calculating confidence scores, source statistics,
 * breakdown details, auto-downgrade conditions, and human-readable rationale.
 */
export function calculateVerificationLevel(
  sources: SourceAttribution[] = [],
  options?: VerificationOptions
): VerificationCalculusResult {
  const autoDowngradesApplied: string[] = [];

  if (!sources || sources.length === 0) {
    return {
      status: 'Unverified',
      confidenceScore: 0,
      institutionalCount: 0,
      communityCount: 0,
      totalSources: 0,
      uniqueSourcesCount: 0,
      deduplicatedSources: [],
      scoreBreakdown: {
        baseScoreSum: 0,
        docBoostSum: 0,
        urlBoostSum: 0,
        rawScore: 0,
        clampedScore: 0
      },
      autoDowngradesApplied: ['No sources provided'],
      reason: 'Unverified: No source attributions attached to story.'
    };
  }

  const deduplicated = deduplicateSources(sources);
  if (deduplicated.length < sources.length) {
    autoDowngradesApplied.push(`Deduplicated ${sources.length - deduplicated.length} redundant source citation(s)`);
  }

  let baseScoreSum = 0;
  let docBoostSum = 0;
  let urlBoostSum = 0;
  let institutionalCount = 0;
  let communityCount = 0;

  for (const src of deduplicated) {
    const weightInfo = getSourceWeight(src.type);
    baseScoreSum += weightInfo.baseScore;

    if (weightInfo.isInstitutional) {
      institutionalCount++;
    } else {
      communityCount++;
    }

    if (src.documentReference && src.documentReference.trim().length > 0) {
      docBoostSum += DOCUMENT_REFERENCE_BOOST;
    }

    const sanitizedUrl = sanitizeSourceUrl(src.url);
    if (sanitizedUrl) {
      urlBoostSum += URL_VERIFICATION_BOOST;
    }
  }

  let rawScore = baseScoreSum + docBoostSum + urlBoostSum;

  // Auto-downgrade penalty if active dispute flag is set
  if (options?.activeDisputeFlag) {
    rawScore = Math.max(0, rawScore - 25);
    autoDowngradesApplied.push('Active editorial dispute flag applied (-25 penalty)');
  }

  const confidenceScore = Math.min(100, Math.max(0, rawScore));

  // Determine Verification Status Tier
  let status: VerificationStatus = 'Unverified';
  let reason = '';

  if (
    confidenceScore >= 90 ||
    (confidenceScore >= 85 && institutionalCount >= 2)
  ) {
    status = 'Strongly Verified';
    reason = `Strongly verified with ${institutionalCount} institutional source(s), ${deduplicated.length} total source(s), and confidence score ${confidenceScore}/100.`;
  } else if (
    confidenceScore >= 70 ||
    (institutionalCount >= 1 && deduplicated.length >= 2 && confidenceScore >= 60)
  ) {
    status = 'Verified';
    reason = `Verified with ${deduplicated.length} source(s) (including ${institutionalCount} institutional) and confidence score ${confidenceScore}/100.`;
  } else if (
    confidenceScore >= 40 ||
    (deduplicated.length >= 1 && confidenceScore >= 30)
  ) {
    status = 'Partially Verified';
    reason = `Partially verified with ${deduplicated.length} source(s) and confidence score ${confidenceScore}/100.`;
  } else {
    status = 'Unverified';
    reason = `Unverified: insufficient source weighting (confidence score ${confidenceScore}/100).`;
  }

  // Safety Gate: Single Eyewitness Cap
  if (deduplicated.length === 1 && !isInstitutionalSource(deduplicated[0].type)) {
    if (status === 'Verified' || status === 'Strongly Verified') {
      status = 'Partially Verified';
      autoDowngradesApplied.push('Single community/eyewitness source capped at Partially Verified');
      reason = `Partially verified: single eyewitness account requires independent institutional corroboration.`;
    }
  }

  return {
    status,
    confidenceScore,
    institutionalCount,
    communityCount,
    totalSources: sources.length,
    uniqueSourcesCount: deduplicated.length,
    deduplicatedSources: deduplicated,
    scoreBreakdown: {
      baseScoreSum,
      docBoostSum,
      urlBoostSum,
      rawScore,
      clampedScore: confidenceScore
    },
    autoDowngradesApplied,
    reason
  };
}

/**
 * Lightweight verification tier calculator returning status and clamped confidence score.
 * Fully compatible with boundary test suites and high-throughput discovery filters.
 */
export function calculateVerificationTier(sources: SourceAttribution[] = []): {
  status: VerificationStatus;
  confidenceScore: number;
} {
  const result = calculateVerificationLevel(sources);
  return {
    status: result.status,
    confidenceScore: result.confidenceScore
  };
}

/**
 * Calculates verification score and status object for story editing and CMS ingestion.
 */
export function calculateVerificationScore(sources: SourceAttribution[] = []): {
  score: number;
  status: VerificationStatus;
} {
  const result = calculateVerificationLevel(sources);
  return {
    score: result.confidenceScore,
    status: result.status
  };
}

/**
 * Generates an end-to-end VerificationRecord entity for story persistence and audit log.
 */
export function calculateVerificationRecord(
  sources: SourceAttribution[] = [],
  methodologyNotes = '',
  verifiedBy = 'Eternal Paws Editorial Trust Board'
): VerificationRecord {
  const result = calculateVerificationLevel(sources);
  
  const generatedNotes = methodologyNotes.trim().length > 0
    ? methodologyNotes.trim()
    : result.reason;

  return {
    status: result.status,
    verifiedAt: new Date().toISOString(),
    verifiedBy,
    sources: result.deduplicatedSources,
    methodologyNotes: generatedNotes,
    confidenceScore: result.confidenceScore
  };
}

/**
 * Validates an array of sources for completeness and integrity.
 */
export function validateSources(sources: SourceAttribution[]): {
  valid: boolean;
  issues: string[];
  uniqueCount: number;
} {
  const issues: string[] = [];
  if (!sources || sources.length === 0) {
    return { valid: false, issues: ['Sources array is empty.'], uniqueCount: 0 };
  }

  const unique = deduplicateSources(sources);
  for (let i = 0; i < unique.length; i++) {
    const s = unique[i];
    if (!s.name || s.name.trim().length < 2) {
      issues.push(`Source #${i + 1} has an empty or invalid name.`);
    }
    if (!SOURCE_WEIGHTS[s.type]) {
      issues.push(`Source #${i + 1} (${s.name}) has an unknown source type: "${s.type}".`);
    }
    if (!s.verifiedDate || isNaN(new Date(s.verifiedDate).getTime())) {
      issues.push(`Source #${i + 1} (${s.name}) has an invalid ISO 8601 verifiedDate.`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    uniqueCount: unique.length
  };
}

/**
 * Generates a public-facing methodology summary for Trust Card components.
 */
export function generateMethodologySummary(
  sources: SourceAttribution[],
  confidenceScore: number,
  status: VerificationStatus
): string {
  if (!sources || sources.length === 0) {
    return 'This narrative is currently unverified and undergoing initial editorial intake.';
  }

  const unique = deduplicateSources(sources);
  const institutionalCount = unique.filter(s => isInstitutionalSource(s.type)).length;
  const communityCount = unique.length - institutionalCount;

  return `Evaluated across ${unique.length} independent source citation(s) including ${institutionalCount} institutional record(s) and ${communityCount} journalistic/eyewitness account(s). Verified with an editorial confidence score of ${confidenceScore}/100 (${status}).`;
}
