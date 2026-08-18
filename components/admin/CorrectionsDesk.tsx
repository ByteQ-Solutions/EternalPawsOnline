'use client';

/**
 * Eternal Paws Platform - Fact-Checking & Corrections Resolution Desk
 * Path: components/admin/CorrectionsDesk.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Save,
  MessageSquare,
} from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { CorrectionItem } from '@/app/api/admin/corrections/route';

export const CorrectionsDesk: React.FC = () => {
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState<{ [key: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchCorrections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/corrections');
      const data = await res.json();
      if (data.success && data.corrections) {
        setCorrections(data.corrections);
      }
    } catch {
      console.warn('Error loading corrections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrections();
  }, []);

  const handleStatusChange = async (id: string, status: CorrectionItem['status']) => {
    setSavingId(id);
    try {
      const notes = resolutionNotes[id] || '';
      await fetch('/api/admin/corrections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, resolutionNotes: notes }),
      });
      setCorrections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status, resolutionNotes: notes } : c))
      );
    } catch {
      console.warn('Error updating correction status');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-borderLight rounded-2xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Fact-Checking & Corrections Resolution Desk
            </h2>
            <Badge variant="unverified" size="sm">
              {corrections.filter((c) => c.status === 'open').length} Open Tickets
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            Resolve reader inquiries, verify primary evidence from shelters & clinics, and maintain editorial transparency.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {corrections.map((corr) => {
          const isSaving = savingId === corr.id;

          return (
            <Card key={corr.id} className="bg-card border-borderLight rounded-2xl p-6 shadow-soft space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLight/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {corr.ticketCode}
                  </span>
                  <span className="text-xs text-inkSubtle">
                    From <strong className="text-inkPrimary">{corr.submitterName}</strong> ({corr.submitterEmail})
                  </span>
                </div>

                <Badge
                  variant={corr.status === 'resolved' ? 'forest' : corr.status === 'in_review' ? 'verified' : 'unverified'}
                  size="sm"
                >
                  {corr.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-xs">
                  <span className="text-inkSubtle">Target Article: </span>
                  <a
                    href={`/stories/${corr.storySlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-forestPrimary hover:underline inline-flex items-center gap-1"
                  >
                    {corr.storyTitle} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 bg-canvas rounded-xl border border-borderLight text-xs space-y-2">
                  <div>
                    <span className="font-bold text-inkPrimary uppercase tracking-wider text-[10px] block">
                      Correction Subject: {corr.correctionField}
                    </span>
                    <p className="text-inkPrimary mt-1 leading-relaxed">{corr.correctionDetails}</p>
                  </div>

                  {corr.sourceUrl && (
                    <div className="pt-2 border-t border-borderLight/60 text-inkSubtle">
                      <span>Verification Source: </span>
                      <a href={corr.sourceUrl} target="_blank" rel="noreferrer" className="text-forestPrimary underline">
                        {corr.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Notes & Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Enter editorial resolution notes (e.g. Verified with shelter records and updated paragraph 3)..."
                    value={resolutionNotes[corr.id] !== undefined ? resolutionNotes[corr.id] : corr.resolutionNotes || ''}
                    onChange={(e) =>
                      setResolutionNotes({ ...resolutionNotes, [corr.id]: e.target.value })
                    }
                    className="w-full min-h-[38px] px-3 py-1.5 bg-canvas border border-borderLight rounded-xl text-xs focus-visible:ring-2 focus-visible:ring-forestPrimary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  {corr.status !== 'in_review' && corr.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(corr.id, 'in_review')}
                      className="min-h-[38px] px-3 py-1.5 border border-borderLight rounded-lg text-xs font-semibold text-inkMuted hover:text-inkPrimary hover:bg-cardMuted"
                    >
                      In Review
                    </button>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleStatusChange(corr.id, 'resolved')}
                    isLoading={isSaving}
                    className="min-h-[38px] px-4 text-xs font-bold shadow-soft"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CorrectionsDesk;
