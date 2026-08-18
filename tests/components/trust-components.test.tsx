import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  VerificationBadge,
  SourceAttributionList,
  ImageDisclosure,
  CorrectionModal,
  TrustCard,
} from '@/components/trust';
import {
  storyBellaRescue,
  storyLunaMiracle,
  sourceMontanaHumane,
  sourceCascadeVet,
} from '@/lib/data/stories';
import type { VerificationRecord } from '@/domain/types';

describe('Trust & Fact-Checking UI Components (F09, F10)', () => {
  describe('VerificationBadge Component', () => {
    it('renders all 4 verification tier badges with accessible ARIA role and label', () => {
      const { rerender } = render(
        <VerificationBadge status="Strongly Verified" confidenceScore={95} />
      );
      const strongly = screen.getByRole('status');
      expect(strongly).toHaveTextContent('Strongly Verified');
      expect(strongly).toHaveAttribute(
        'aria-label',
        'Verification status: Strongly Verified, confidence score 95%'
      );

      rerender(<VerificationBadge status="Verified" confidenceScore={80} />);
      expect(screen.getByRole('status')).toHaveTextContent('Verified');

      rerender(<VerificationBadge status="Partially Verified" confidenceScore={50} />);
      expect(screen.getByRole('status')).toHaveTextContent('Partially Verified');

      rerender(<VerificationBadge status="Unverified" confidenceScore={10} />);
      expect(screen.getByRole('status')).toHaveTextContent('Unverified');
    });

    it('renders confidence score text when showScore is true', () => {
      render(
        <VerificationBadge
          status="Strongly Verified"
          confidenceScore={98}
          showScore={true}
        />
      );
      expect(screen.getByText('(98%)')).toBeInTheDocument();
    });

    it('supports sm, md, and lg sizes', () => {
      const { rerender } = render(
        <VerificationBadge status="Verified" size="sm" />
      );
      expect(screen.getByRole('status').className).toContain('text-xs');

      rerender(<VerificationBadge status="Verified" size="lg" />);
      expect(screen.getByRole('status').className).toContain('text-base');
    });
  });

  describe('SourceAttributionList Component', () => {
    it('renders transparent list of sources with badges and document references', () => {
      render(
        <SourceAttributionList
          sources={[sourceMontanaHumane, sourceCascadeVet]}
        />
      );
      expect(
        screen.getByText(/Humane Society of Western Montana/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Sarah Jenkins, DVM/i)).toBeInTheDocument();
      expect(screen.getByText(/Ref: INTAKE-DOC-MT-2024-8841/i)).toBeInTheDocument();
      expect(screen.getByText(/Ref: VET-REC-2024-1109/i)).toBeInTheDocument();
    });

    it('renders empty state message when no sources are provided', () => {
      render(<SourceAttributionList sources={[]} />);
      expect(
        screen.getByText(/Verification in progress by editorial staff/i)
      ).toBeInTheDocument();
    });

    it('adds scrollable container constraint when more than 5 sources are present', () => {
      const manySources = Array.from({ length: 8 }, (_, i) => ({
        id: `src-${i}`,
        name: `Institutional Source ${i}`,
        type: 'shelter' as const,
        verifiedDate: '2025-01-01T00:00:00Z',
      }));

      const { container } = render(<SourceAttributionList sources={manySources} />);
      const scrollableDiv = container.querySelector('.max-h-80');
      expect(scrollableDiv).toBeInTheDocument();
    });
  });

  describe('ImageDisclosure Component', () => {
    it('renders AI visual reconstruction disclosure pill and rationale', () => {
      render(<ImageDisclosure image={storyLunaMiracle.heroImage} />);
      expect(
        screen.getByText(/AI Visual Reconstruction • Transparency Disclosed/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Midjourney v6 & Adobe Firefly/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Archival visual reconstruction created from verified veterinary blueprints/i)
      ).toBeInTheDocument();
    });

    it('renders standard photo credit when image is authentic photography', () => {
      render(<ImageDisclosure image={storyBellaRescue.heroImage} />);
      expect(
        screen.getByText(/Montana Humane Society \/ Mark Peterson Photography/i)
      ).toBeInTheDocument();
    });
  });

  describe('CorrectionModal Component', () => {
    it('renders when isOpen is true and validates required fields', async () => {
      const handleClose = vi.fn();
      render(
        <CorrectionModal
          isOpen={true}
          onClose={handleClose}
          storySlug="bella-blind-beagle"
          storyTitle="Bella's Journey"
        />
      );

      expect(
        screen.getByRole('heading', { name: /Submit a Factual Correction/i })
      ).toBeInTheDocument();

      // Submit empty form to trigger validation
      const submitBtn = screen.getByRole('button', {
        name: /Submit Correction Ticket/i,
      });
      fireEvent.click(submitBtn);

      expect(
        await screen.findByText(/Please provide your full name or organization/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please provide a valid email address/i)
      ).toBeInTheDocument();
    });

    it('submits valid form and displays ticket reference code', async () => {
      render(
        <CorrectionModal
          isOpen={true}
          onClose={vi.fn()}
          storySlug="bella-blind-beagle"
          storyTitle="Bella's Journey"
        />
      );

      fireEvent.change(screen.getByLabelText(/Your Name \/ Organization/i), {
        target: { value: 'Dr. Sarah Jenkins' },
      });
      fireEvent.change(screen.getByLabelText(/Contact Email/i), {
        target: { value: 'sarah@vetclinic.org' },
      });
      fireEvent.change(screen.getByLabelText(/Specific Claim in Question/i), {
        target: { value: 'The rescue date was November 12th not 14th.' },
      });
      fireEvent.change(screen.getByLabelText(/Proposed Correction & Context/i), {
        target: {
          value: 'Official clinical intake documentation confirms date of November 12th.',
        },
      });

      const submitBtn = screen.getByRole('button', {
        name: /Submit Correction Ticket/i,
      });
      fireEvent.click(submitBtn);

      expect(
        await screen.findByText(/Correction Ticket Received/i, {}, { timeout: 2000 })
      ).toBeInTheDocument();
      expect(screen.getByText(/CORR-/i)).toBeInTheDocument();
    });
  });

  describe('TrustCard Component', () => {
    it('renders fact checker, verification date, trust score meter, and source list', () => {
      render(
        <TrustCard
          verification={storyBellaRescue.verification}
          storySlug={storyBellaRescue.slug}
          storyTitle={storyBellaRescue.title}
        />
      );

      expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
      expect(screen.getByText('95 / 100')).toBeInTheDocument();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '95');

      expect(
        screen.getByRole('button', { name: /Verified Sources \(2\)/i })
      ).toBeInTheDocument();
    });

    it('toggles sources expand/collapse state when toggle button is clicked', () => {
      render(
        <TrustCard
          verification={storyBellaRescue.verification}
          storySlug={storyBellaRescue.slug}
          storyTitle={storyBellaRescue.title}
        />
      );

      const toggleButton = screen.getByRole('button', {
        name: /Verified Sources \(2\)/i,
      });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('falls back to "Eternal Paws Editorial Board" when factChecker is empty', () => {
      const recordWithoutFactChecker: VerificationRecord = {
        ...storyBellaRescue.verification,
        verifiedBy: '',
      };

      render(
        <TrustCard
          verification={recordWithoutFactChecker}
          storySlug="test-slug"
        />
      );

      expect(
        screen.getByText(/Eternal Paws Editorial Board/i)
      ).toBeInTheDocument();
    });

    it('opens CorrectionModal when "Submit a Correction" button is clicked', async () => {
      render(
        <TrustCard
          verification={storyBellaRescue.verification}
          storySlug={storyBellaRescue.slug}
          storyTitle={storyBellaRescue.title}
        />
      );

      const corrBtn = screen.getByRole('button', {
        name: /Submit a Correction/i,
      });
      fireEvent.click(corrBtn);

      expect(
        await screen.findByRole('heading', { name: /Submit a Factual Correction/i })
      ).toBeInTheDocument();
    });
  });
});
