'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, ChevronDown, ArrowUpRight } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { SourceAttributionList } from './SourceAttributionList';
import { CorrectionModal } from './CorrectionModal';
import { cn } from '@/lib/utils';
import type { VerificationRecord } from '@/domain/types';

export interface TrustCardProps {
  verification: VerificationRecord;
  storySlug: string;
  storyTitle?: string;
  className?: string;
}

export const TrustCard: React.FC<TrustCardProps> = ({
  verification,
  storySlug,
  storyTitle,
  className,
}) => {
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(true);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  const factCheckerName =
    verification?.verifiedBy &&
    verification.verifiedBy.trim().length > 0 &&
    !verification.verifiedBy.toLowerCase().includes('elena')
      ? verification.verifiedBy.trim()
      : 'Eternal Paws Editorial & Verification Desk';

  const sourceCount = verification?.sources?.length || 0;
  const status = verification?.status || 'Unverified';
  const confidenceScore = verification?.confidenceScore ?? 0;

  return (
    <>
      <section
        aria-labelledby="trust-card-heading"
        className={cn('rounded-xl border border-borderLight bg-card shadow-soft overflow-hidden my-8', className)}
      >
        {/* Header Banner */}
        <div className="bg-cardMuted/60 p-5 sm:p-6 border-b border-borderLight">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forestPrimary flex-shrink-0" aria-hidden="true" />
                <h3 id="trust-card-heading" className="font-serif text-lg sm:text-xl font-bold text-inkPrimary">
                  Editorial Trust & Verification Record
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted">
                Verified against authentic records to prevent misinformation and clickbait.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <VerificationBadge
                status={status}
                confidenceScore={confidenceScore}
                size="md"
                showScore={true}
              />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-borderLight text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-inkSubtle uppercase tracking-wider font-bold text-[11px] block">
                Fact-Checked By
              </span>
              <div className="flex items-center gap-1.5 text-inkPrimary font-medium">
                <UserCheck className="w-4 h-4 text-forestPrimary flex-shrink-0" aria-hidden="true" />
                <span>{factCheckerName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-inkSubtle uppercase tracking-wider font-bold text-[11px] block">
                Verification Date
              </span>
              <div className="text-inkPrimary font-medium">
                {verification?.verifiedAt
                  ? new Date(verification.verifiedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Pending Review'}
              </div>
            </div>
          </div>

          {/* Confidence Score Progress Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-inkPrimary">Calculated Trust Score</span>
              <span className="font-mono font-bold text-forestPrimary">
                {confidenceScore} / 100
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={confidenceScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Trust confidence score"
              className="w-full bg-cardMuted rounded-full h-2.5 overflow-hidden border border-borderLight"
            >
              <div
                className={cn(
                  'h-full transition-all duration-500 rounded-full',
                  confidenceScore >= 85
                    ? 'bg-forestPrimary'
                    : confidenceScore >= 60
                    ? 'bg-goldAccent'
                    : 'bg-inkSubtle'
                )}
                style={{ width: `${Math.max(5, confidenceScore)}%` }}
              />
            </div>
          </div>

          {/* Collapsible Source List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                id="trust-sources-toggle"
                aria-expanded={isSourcesExpanded}
                aria-controls="trust-sources-panel"
                onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                className="min-h-[44px] -ml-1 px-2 rounded flex items-center gap-2 font-semibold text-sm text-inkPrimary hover:text-forestPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <span>Verified Sources ({sourceCount})</span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-inkSubtle transition-transform duration-200',
                    isSourcesExpanded && 'transform rotate-180 text-forestPrimary'
                  )}
                  aria-hidden="true"
                />
              </button>
              <Link
                href="/fact-checking"
                className="text-xs text-forestPrimary font-semibold hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                Scoring Methodology &rarr;
              </Link>
            </div>

            <div
              id="trust-sources-panel"
              role="region"
              aria-labelledby="trust-sources-toggle"
              hidden={!isSourcesExpanded}
            >
              <SourceAttributionList sources={verification?.sources || []} />
            </div>
          </div>

          {/* Methodology Notes */}
          {verification?.methodologyNotes && (
            <div className="p-3.5 rounded-lg bg-cardMuted/50 border border-borderLight text-xs sm:text-sm text-inkMuted space-y-1">
              <strong className="text-inkPrimary block font-semibold">Verification Methodology:</strong>
              <p className="leading-relaxed">{verification.methodologyNotes}</p>
            </div>
          )}

          {/* Bottom Action / Correction Trigger Bar */}
          <div className="pt-4 border-t border-borderLight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <p className="text-inkSubtle">
              Notice a factual error or have supplementary documentation?
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCorrectionModalOpen(true)}
                className="min-h-[44px] px-3.5 py-2 rounded-md bg-forestLight hover:bg-forestLight/80 text-forestPrimary font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary inline-flex items-center gap-1.5"
              >
                <span>Submit a Correction</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Correction Modal */}
      <CorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        storySlug={storySlug}
        storyTitle={storyTitle}
      />
    </>
  );
};

export default TrustCard;
