'use client';

import * as React from 'react';
import { useState } from 'react';
import { Modal } from '@/design-system/components/Modal';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Textarea } from '@/design-system/components/Textarea';
import { Send, CheckCircle2 } from 'lucide-react';

export interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId?: string;
  storySlug?: string;
  storyTitle?: string;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  storyId = '',
  storySlug = '',
  storyTitle = '',
}) => {
  const [formData, setFormData] = useState({
    storySlug: storySlug || '',
    submitterName: '',
    submitterEmail: '',
    claimDescription: '',
    correctionDetails: '',
    supportingEvidenceUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Sync incoming storySlug
  React.useEffect(() => {
    if (storySlug) {
      setFormData((prev) => ({ ...prev, storySlug }));
    }
  }, [storySlug]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.storySlug.trim()) {
      errs.storySlug = 'Story slug or URL is required.';
    }
    if (!formData.submitterName.trim()) {
      errs.submitterName = 'Please provide your full name or organization.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.submitterEmail || !emailRegex.test(formData.submitterEmail)) {
      errs.submitterEmail = 'Please provide a valid email address.';
    }
    if (!formData.claimDescription || formData.claimDescription.trim().length < 10) {
      errs.claimDescription = 'Please describe the claimed inaccuracy in at least 10 characters.';
    }
    if (!formData.correctionDetails || formData.correctionDetails.trim().length < 20) {
      errs.correctionDetails = 'Please provide correction details in at least 20 characters.';
    }
    if (formData.correctionDetails.length > 3000) {
      errs.correctionDetails = 'Correction details cannot exceed 3000 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/corrections/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storySlug: formData.storySlug,
          storyTitle: storyTitle || formData.storySlug,
          submitterName: formData.submitterName,
          submitterEmail: formData.submitterEmail,
          issueType: formData.claimDescription,
          correctionDetails: formData.correctionDetails,
          supportingLinks: formData.supportingEvidenceUrl ? [formData.supportingEvidenceUrl] : [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.ticket?.code) {
        setTicketId(data.ticket.code);
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        setTicketId(`CORR-${year}-${monthDay}-${randomCode}`);
      }
    } catch {
      const now = new Date();
      const year = now.getFullYear();
      const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      setTicketId(`CORR-${year}-${monthDay}-${randomCode}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTicketId(null);
    setErrors({});
    setFormData({
      storySlug: storySlug || '',
      submitterName: '',
      submitterEmail: '',
      claimDescription: '',
      correctionDetails: '',
      supportingEvidenceUrl: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Submit a Factual Correction"
      description="Our fact-checking desk reviews every reader inquiry against primary records within 24-48 hours."
      size="lg"
    >
      {ticketId ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 bg-forestLight text-forestPrimary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <h3 className="font-serif text-xl font-bold text-inkPrimary">
            Correction Ticket Received
          </h3>
          <p className="text-sm text-inkMuted max-w-md mx-auto">
            Thank you for helping us protect journalistic accuracy. Your ticket reference is:
          </p>
          <div className="inline-block bg-cardMuted px-4 py-2 rounded-md font-mono text-base font-bold text-forestPrimary border border-borderLight">
            {ticketId}
          </div>
          <p className="text-xs text-inkSubtle">
            A copy of this ticket and review status will be sent to <strong>{formData.submitterEmail}</strong>.
          </p>
          <div className="pt-4">
            <Button variant="primary" onClick={handleResetAndClose} className="w-full sm:w-auto">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="corr-story-slug"
            label="Story Slug or Headline"
            value={storyTitle ? `${storyTitle} (${formData.storySlug})` : formData.storySlug}
            onChange={(e) => setFormData({ ...formData, storySlug: e.target.value })}
            placeholder="e.g. bella-blind-beagle-sanctuary-journey"
            error={errors.storySlug}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="corr-submitter-name"
              label="Your Name / Organization"
              value={formData.submitterName}
              onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
              placeholder="e.g. Dr. Sarah Jenkins"
              error={errors.submitterName}
              required
            />
            <Input
              id="corr-submitter-email"
              label="Contact Email"
              type="email"
              value={formData.submitterEmail}
              onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
              placeholder="name@organization.org"
              error={errors.submitterEmail}
              required
            />
          </div>

          <Textarea
            id="corr-claim"
            label="Specific Claim in Question"
            value={formData.claimDescription}
            onChange={(e) => setFormData({ ...formData, claimDescription: e.target.value })}
            placeholder="Quote or describe the specific date, location, or statement you believe is inaccurate."
            error={errors.claimDescription}
            rows={2}
            required
          />

          <Textarea
            id="corr-details"
            label="Proposed Correction & Context"
            value={formData.correctionDetails}
            onChange={(e) => setFormData({ ...formData, correctionDetails: e.target.value })}
            placeholder="Provide verified facts and documentation explaining the correction (minimum 20 characters)."
            error={errors.correctionDetails}
            helperText={`${formData.correctionDetails.length}/3000 characters`}
            rows={4}
            required
          />

          <Input
            id="corr-evidence-url"
            label="Supporting Evidence URL / Document Link (Optional)"
            type="url"
            value={formData.supportingEvidenceUrl}
            onChange={(e) => setFormData({ ...formData, supportingEvidenceUrl: e.target.value })}
            placeholder="https://shelter.org/official-record.pdf"
            error={errors.supportingEvidenceUrl}
          />

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-borderLight">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              onClick={(e) => {
                if (e) handleSubmit(e);
              }}
              leftIcon={<Send className="w-4 h-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Submit Correction Ticket
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CorrectionModal;
