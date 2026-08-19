'use client';

/**
 * Eternal Paws Platform - Reader Submissions Moderation Inbox
 * Path: components/admin/SubmissionsInbox.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MapPin,
  Send,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { CommunitySubmission as SubmissionItem } from '@/lib/services/submission-service';

export interface SubmissionsInboxProps {
  onStoryPublished?: () => void;
}

export const SubmissionsInbox: React.FC<SubmissionsInboxProps> = ({ onStoryPublished }) => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string; liveUrl?: string } | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (data.success && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch {
      console.warn('Error loading submissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 1-Click AI Polish & Publish directly to live site
  const handleAIPublish = async (sub: SubmissionItem) => {
    setProcessingId(sub.id);
    setFeedback(null);

    try {
      // 1. Polish text with AI
      const polishRes = await fetch('/api/admin/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sub.storyText, dogName: sub.dogName }),
      });
      const polishData = await polishRes.json();
      const polishedContent = polishData.polishedText || sub.storyText;

      const slug = `${sub.dogName.toLowerCase()}-${sub.city.toLowerCase()}-rescue-${Date.now().toString().slice(-4)}`;

      // 2. Publish to Live Stories with submitted image
      const publishRes = await fetch('/api/admin/stories/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${sub.dogName}'s Incredible Survival and Recovery in ${sub.city}`,
          slug,
          excerpt: `Submitted by ${sub.submitterName}: The heartwarming true story of ${sub.dogName}, a ${sub.dogBreed} from ${sub.city}, ${sub.state}.`,
          content: polishedContent,
          dogName: sub.dogName,
          dogBreed: sub.dogBreed,
          category: 'rescues',
          heroImage: {
            url: sub.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
            altText: `Photo of ${sub.dogName}, submitted by ${sub.submitterName}`,
            credit: sub.photoCredit || `Photo courtesy of ${sub.submitterName}`,
          },
          location: { city: sub.city, stateOrProvince: sub.state, country: 'United States' },
          readTimeMinutes: 3,
        }),
      });

      const publishData = await publishRes.json();

      // 3. Update Submission Status to Approved
      await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, status: 'approved' }),
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s))
      );

      setFeedback({
        id: sub.id,
        message: `Successfully polished and published ${sub.dogName}'s story!`,
        liveUrl: publishData.liveUrl || `/stories/${slug}`,
      });

      if (onStoryPublished) {
        onStoryPublished();
      }
    } catch {
      setFeedback({
        id: sub.id,
        message: 'Error during AI publishing pipeline.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: SubmissionItem['status']) => {
    try {
      await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch {
      console.warn('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-borderLight rounded-2xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Reader Submissions Moderation Inbox
            </h2>
            <Badge variant="forest" size="sm">
              {submissions.filter((s) => s.status === 'pending').length} Pending
            </Badge>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            Review user-submitted dog stories from /submit-story, polish with AI, and publish to live corpus.
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="p-8 text-center bg-card border border-borderLight rounded-2xl text-inkMuted text-sm">
          No submissions pending in inbox.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isProcessing = processingId === sub.id;
            const isApproved = sub.status === 'approved';

            return (
              <Card key={sub.id} className="bg-card border-borderLight rounded-2xl p-6 shadow-soft space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLight/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-forestPrimary bg-forestLight/60 px-2.5 py-1 rounded-lg">
                      {sub.ticketCode}
                    </span>
                    <span className="text-xs text-inkSubtle">
                      Submitted by <strong className="text-inkPrimary">{sub.submitterName}</strong> ({sub.submitterEmail})
                    </span>
                  </div>

                  <Badge
                    variant={sub.status === 'approved' ? 'forest' : sub.status === 'under_review' ? 'verified' : 'unverified'}
                    size="sm"
                  >
                    {sub.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-inkSubtle">
                    <span className="font-bold text-inkPrimary text-sm">
                      🐾 {sub.dogName} ({sub.dogBreed})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {sub.city}, {sub.state}
                    </span>
                    <span>•</span>
                    <span>Relationship: {sub.relationship}</span>
                  </div>

                  {sub.photoUrl && (
                    <div className="flex items-center gap-3 p-3 bg-canvas rounded-xl border border-borderLight">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sub.photoUrl}
                        alt={`Photo of ${sub.dogName}`}
                        className="w-20 h-20 object-cover rounded-lg border border-borderLight shadow-sm flex-shrink-0"
                      />
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-forestPrimary font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> Submitter Uploaded Photo
                        </div>
                        <p className="text-inkMuted">{sub.photoCredit || `Photo by ${sub.submitterName}`}</p>
                        <p className="text-inkSubtle text-[11px] font-mono">{sub.photoName || 'dog_photo.jpg'}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-canvas rounded-xl border border-borderLight text-xs leading-relaxed text-inkPrimary font-serif whitespace-pre-line">
                    {sub.storyText}
                  </div>
                </div>

                {feedback && feedback.id === sub.id && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between">
                    <span>{feedback.message}</span>
                    {feedback.liveUrl && (
                      <a
                        href={feedback.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-forestPrimary font-bold inline-flex items-center gap-1"
                      >
                        View Live Article <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-inkSubtle">
                    Received: {new Date(sub.submittedAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {sub.status !== 'approved' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(sub.id, 'under_review')}
                          className="min-h-[36px] px-3 py-1.5 border border-borderLight rounded-lg text-xs font-semibold text-inkMuted hover:text-inkPrimary hover:bg-cardMuted transition-colors"
                        >
                          Mark Under Review
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                          className="min-h-[36px] px-3 py-1.5 border border-borderLight rounded-lg text-xs font-semibold text-error hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleAIPublish(sub)}
                      isLoading={isProcessing}
                      disabled={isApproved}
                      className="min-h-[36px] px-4 text-xs font-bold shadow-soft"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-goldLight" />
                      {isApproved ? 'Published Live' : '⚡ 1-Click AI Polish & Publish'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmissionsInbox;
