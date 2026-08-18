'use client';

import * as React from 'react';
import { ExternalLink, FileText, Building2, UserCheck, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SourceAttribution, SourceType } from '@/domain/types';
import { sanitizeSourceUrl } from '@/domain/verification';

export interface SourceAttributionListProps {
  sources: SourceAttribution[];
  className?: string;
}

const sourceTypeLabels: Record<
  SourceType,
  {
    label: string;
    isInstitutional: boolean;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  }
> = {
  police: { label: 'Police / SAR Record', isInstitutional: true, icon: Shield },
  court_record: { label: 'Court Docket', isInstitutional: true, icon: FileText },
  official_agency: { label: 'Official Agency', isInstitutional: true, icon: Building2 },
  veterinary_clinic: { label: 'Veterinary Case File', isInstitutional: true, icon: Building2 },
  shelter: { label: 'Shelter / Rescue Intake', isInstitutional: true, icon: Building2 },
  news_outlet: { label: 'News Outlet', isInstitutional: false, icon: FileText },
  eyewitness: { label: 'Eyewitness Interview', isInstitutional: false, icon: UserCheck },
};

export const SourceAttributionList: React.FC<SourceAttributionListProps> = ({ sources, className }) => {
  if (!sources || sources.length === 0) {
    return (
      <div className={cn('p-4 rounded-lg bg-cardMuted border border-borderLight text-center', className)}>
        <div className="flex items-center justify-center gap-2 text-inkMuted text-sm">
          <AlertCircle className="w-4 h-4 text-inkSubtle flex-shrink-0" aria-hidden="true" />
          <span>Verification in progress by editorial staff. No public source records attached yet.</span>
        </div>
      </div>
    );
  }

  const isScrollable = sources.length > 5;

  return (
    <div
      tabIndex={isScrollable ? 0 : undefined}
      aria-label={isScrollable ? 'Scrollable source attributions list' : undefined}
      className={cn(
        'space-y-3 focus:outline-none focus:ring-1 focus:ring-forestPrimary rounded-lg',
        isScrollable && 'max-h-80 overflow-y-auto pr-1.5',
        className
      )}
    >
      <ol className="space-y-2.5" role="list">
        {sources.map((source, index) => {
          const typeMeta = sourceTypeLabels[source.type] || {
            label: source.type,
            isInstitutional: false,
            icon: FileText,
          };
          const safeUrl = sanitizeSourceUrl(source.url);
          const TypeIcon = typeMeta.icon;

          return (
            <li
              key={source.id || `src-${index}`}
              className="p-3.5 rounded-lg bg-card border border-borderLight hover:border-forestPrimary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold',
                        typeMeta.isInstitutional
                          ? 'bg-forestLight text-forestPrimary border border-forestPrimary/20'
                          : 'bg-cardMuted text-inkMuted border border-borderLight'
                      )}
                    >
                      <TypeIcon className="w-3 h-3" aria-hidden="true" />
                      <span>{typeMeta.label}</span>
                    </span>

                    {source.documentReference && (
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                        Ref: {source.documentReference}
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-inkPrimary leading-snug">
                    {source.organization ? `${source.organization} — ${source.name}` : source.name}
                  </h4>

                  {source.notes && (
                    <p className="text-xs text-inkMuted leading-relaxed pt-0.5">
                      {source.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0 pt-1 sm:pt-0">
                  {safeUrl && (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-md text-xs font-semibold text-forestPrimary hover:bg-forestLight inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary transition-colors"
                    >
                      <span>View Record</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-borderLight/60 flex items-center justify-between text-xs text-inkSubtle">
                <span>
                  Verified: {new Date(source.verifiedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="capitalize">{typeMeta.isInstitutional ? 'Institutional Archive' : 'Community Corroboration'}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default SourceAttributionList;
