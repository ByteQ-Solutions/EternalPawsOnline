'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Send, Search, Filter } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Input } from '@/design-system/components/Input';
import { Textarea } from '@/design-system/components/Textarea';
import { Button } from '@/design-system/components/Button';
import type { CorrectionRecord } from '@/domain/types';

const sampleCorrections: CorrectionRecord[] = [
  {
    id: 'corr-2025-001',
    storySlug: 'daisy-500-mile-reunion-microchip-miracle',
    reportedDate: '2025-02-12T12:00:00Z',
    resolvedDate: '2025-02-12T14:00:00Z',
    correctionType: 'clarification',
    description: 'Clarified the specific model year of the universal microchip scanner used during shelter intake.',
    status: 'Resolved & Published',
  },
  {
    id: 'corr-2025-002',
    storySlug: 'barnaby-golden-retriever-flood-survival',
    reportedDate: '2025-01-23T09:15:00Z',
    resolvedDate: '2025-01-23T11:45:00Z',
    correctionType: 'attribution_update',
    description: 'Updated the formal name of the Western North Carolina Swift Water Rescue Battalion in source attribution.',
    status: 'Resolved & Published',
  },
  {
    id: 'corr-2025-003',
    storySlug: 'buster-lost-and-found-legacy',
    reportedDate: '2025-02-01T10:00:00Z',
    resolvedDate: '2025-02-01T14:00:00Z',
    correctionType: 'factual_fix',
    description: 'Corrected search grid radius from 35 square miles to 28 square miles based on updated GIS volunteer logs.',
    status: 'Resolved & Published',
  },
];

export default function CorrectionsPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Correction Intake Form State
  const [formData, setFormData] = useState({
    storySlug: '',
    submitterName: '',
    submitterEmail: '',
    claimDescription: '',
    correctionDetails: '',
    supportingEvidenceUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const filteredCorrections = sampleCorrections.filter((item) => {
    const matchesQuery =
      item.storySlug.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.storySlug.trim()) {
      errs.storySlug = 'Story reference or slug is required.';
    }
    if (!formData.submitterName.trim()) {
      errs.submitterName = 'Please provide your full name or organization.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.submitterEmail || !emailRegex.test(formData.submitterEmail)) {
      errs.submitterEmail = 'Valid contact email is required.';
    }
    if (!formData.claimDescription || formData.claimDescription.trim().length < 10) {
      errs.claimDescription = 'Please describe the claimed inaccuracy in at least 10 characters.';
    }
    if (!formData.correctionDetails || formData.correctionDetails.trim().length < 20) {
      errs.correctionDetails = 'Correction details must be at least 20 characters.';
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
    setTimeout(() => {
      const now = new Date();
      const year = now.getFullYear();
      const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const generatedTicket = `CORR-${year}-${monthDay}-${randomCode}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
    }, 300);
  };

  const handleResetForm = () => {
    setTicketId(null);
    setErrors({});
    setFormData({
      storySlug: '',
      submitterName: '',
      submitterEmail: '',
      claimDescription: '',
      correctionDetails: '',
      supportingEvidenceUrl: '',
    });
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Corrections Desk' }]} className="mb-6" />

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Public Accountability Log</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Public Corrections & Transparency Log
          </h1>
          <p className="text-lg sm:text-xl text-inkMuted leading-relaxed">
            We are committed to swift, transparent accountability. When any factual error, date discrepancy, or source misattribution is identified, we document the full resolution here.
          </p>
        </header>

        {/* Search & Filter Controls */}
        <section className="py-6 space-y-4 border-b border-borderLight">
          <h2 className="font-serif text-2xl font-bold text-inkPrimary">
            Corrections Ledger
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                id="corr-filter"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search by story slug, description, or ticket ID..."
                leftIcon={<Search className="w-4 h-4" aria-hidden="true" />}
                aria-label="Filter corrections"
              />
            </div>
            <div className="sm:w-48">
              <select
                id="corr-status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter by correction status"
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-card text-inkPrimary border border-borderLight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <option value="all">All Statuses</option>
                <option value="Resolved & Published">Resolved & Published</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Corrections List / Empty State */}
          {filteredCorrections.length === 0 ? (
            <div className="p-8 rounded-xl bg-cardMuted/60 border border-borderLight text-center space-y-2 my-4">
              <ShieldCheck className="w-8 h-8 text-forestPrimary mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-inkPrimary">
                No published corrections on record for this search query. All facts remain verified.
              </p>
              <p className="text-xs text-inkMuted">
                Try clearing your search filters to view historical resolved records.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2" role="list" aria-label="List of published corrections">
              {filteredCorrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-4 sm:p-5 rounded-lg bg-card border border-borderLight space-y-2 hover:border-forestPrimary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-forestPrimary bg-forestLight px-2 py-0.5 rounded">
                        {corr.id}
                      </span>
                      <span className="text-inkSubtle">
                        {new Date(corr.reportedDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-forestPrimary">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{corr.status}</span>
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/stories/${corr.storySlug}`}
                      className="font-serif font-bold text-inkPrimary hover:text-forestPrimary text-base hover:underline inline-flex items-center gap-1"
                    >
                      <span>Story: {corr.storySlug}</span>
                    </Link>
                  </div>

                  <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                    {corr.description}
                  </p>

                  <div className="pt-1 text-[11px] text-inkSubtle border-t border-borderLight/60 flex items-center justify-between">
                    <span className="capitalize font-medium">Type: {corr.correctionType.replace(/_/g, ' ')}</span>
                    {corr.resolvedDate && (
                      <span>
                        Resolved: {new Date(corr.resolvedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Interactive Correction Submission Intake Form */}
        <section className="py-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
              Submit a Factual Correction
            </h2>
            <p className="text-sm text-inkMuted">
              Notice a factual error, date discrepancy, or have documentation to add? Our fact-checking team will review your inquiry within 24-48 hours.
            </p>
          </div>

          {ticketId ? (
            <div className="p-6 rounded-xl bg-forestLight/60 border border-forestPrimary/30 text-center space-y-4">
              <div className="w-12 h-12 bg-forestPrimary text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-inkPrimary">
                Correction Ticket Received
              </h3>
              <p className="text-sm text-inkMuted max-w-md mx-auto">
                Thank you for helping us maintain journalistic accuracy. Your ticket tracking reference is:
              </p>
              <div className="inline-block bg-card px-4 py-2 rounded-md font-mono text-base font-bold text-forestPrimary border border-forestPrimary/20">
                {ticketId}
              </div>
              <p className="text-xs text-inkSubtle">
                A confirmation copy and status updates will be sent to <strong>{formData.submitterEmail}</strong>.
              </p>
              <div className="pt-2">
                <Button variant="primary" onClick={handleResetForm}>
                  Submit Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-borderLight shadow-soft space-y-4">
              <Input
                id="form-story-slug"
                label="Story Headline, Slug, or URL"
                value={formData.storySlug}
                onChange={(e) => setFormData({ ...formData, storySlug: e.target.value })}
                placeholder="e.g. bella-blind-beagle-sanctuary-journey or https://eternal-paws.com/stories/bella-blind-beagle"
                error={errors.storySlug}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="form-submitter-name"
                  label="Your Full Name / Organization"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="e.g. Jane Doe / Shelter Director"
                  error={errors.submitterName}
                  required
                />
                <Input
                  id="form-submitter-email"
                  label="Contact Email Address"
                  type="email"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  placeholder="journalist@news.org"
                  error={errors.submitterEmail}
                  required
                />
              </div>

              <Textarea
                id="form-claim"
                label="Specific Statement or Fact in Question"
                value={formData.claimDescription}
                onChange={(e) => setFormData({ ...formData, claimDescription: e.target.value })}
                placeholder="Quote or pinpoint the specific date, hospital name, location, or quote you believe is inaccurate."
                error={errors.claimDescription}
                rows={2}
                required
              />

              <Textarea
                id="form-details"
                label="Proposed Correction & Evidentiary Context"
                value={formData.correctionDetails}
                onChange={(e) => setFormData({ ...formData, correctionDetails: e.target.value })}
                placeholder="Provide verified facts and documentation explaining the correction (minimum 20 characters)."
                error={errors.correctionDetails}
                helperText={`${formData.correctionDetails.length}/3000 characters`}
                rows={4}
                required
              />

              <Input
                id="form-evidence-url"
                label="Supporting Evidence URL / Document Link (Optional)"
                type="url"
                value={formData.supportingEvidenceUrl}
                onChange={(e) => setFormData({ ...formData, supportingEvidenceUrl: e.target.value })}
                placeholder="https://shelter.org/official-press-release.pdf"
                error={errors.supportingEvidenceUrl}
              />

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" aria-hidden="true" />}
                  className="w-full sm:w-auto"
                >
                  Submit Correction Ticket
                </Button>
              </div>
            </form>
          )}
        </section>
      </Container>
    </div>
  );
}
