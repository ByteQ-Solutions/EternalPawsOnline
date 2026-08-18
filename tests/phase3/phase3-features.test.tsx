/**
 * Phase 3 Feature Suite: Audio Narration, Follow-Up Timeline, Storage, Emails & Localization
 * Path: tests/phase3/phase3-features.test.tsx
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioNarrationPlayer } from '@/components/article/AudioNarrationPlayer';
import { StoryTimelineUpdates } from '@/components/article/StoryTimelineUpdates';
import { EmailService } from '@/lib/services/email-service';
import { StorageService } from '@/lib/services/storage-service';
import { ES_TRANSLATIONS } from '@/lib/i18n/translations';
import { AnalyticsTracker } from '@/lib/analytics/tracker';

// Setup SpeechSynthesis mock for JSDOM
beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.speechSynthesis = {
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      paused: false,
      pending: false,
      speaking: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onvoiceschanged: null,
    } as unknown as SpeechSynthesis;

    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = vi.fn().mockImplementation(function (this: { text: string; rate: number; pitch: number; voice: null; onend: null; onerror: null }, text: string) {
      this.text = text;
      this.rate = 1.0;
      this.pitch = 1.0;
      this.voice = null;
      this.onend = null;
      this.onerror = null;
    });
  }
});

describe('Phase 3 Advanced Production Features Suite', () => {
  describe('1. Audio Story Narration Player Component', () => {
    it('renders audio player with accessible region label and calm storytelling badge', () => {
      render(
        <AudioNarrationPlayer
          storyTitle="Bella: The Blind Beagle Journey"
          storyContent="Bella navigated 30 miles of forest."
          dogName="Bella"
        />
      );

      expect(screen.getByRole('region', { name: /audio narration for bella/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /listen to bella's story with calm storytelling voice/i })).toBeInTheDocument();
      expect(screen.getAllByText(/Calm Storyteller/i).length).toBeGreaterThanOrEqual(1);
    });

    it('allows switching between voice tone presets (Calm Storyteller, Classic Editorial, Gentle Bedtime)', () => {
      render(
        <AudioNarrationPlayer
          storyTitle="Max the Hero Dog"
          storyContent="Max dug through snow."
          dogName="Max"
        />
      );

      const editorialBtn = screen.getByRole('button', { name: /Classic Editorial/i });
      fireEvent.click(editorialBtn);
      expect(editorialBtn).toHaveAttribute('aria-pressed', 'true');

      const bedtimeBtn = screen.getByRole('button', { name: /Gentle & Relaxing/i });
      fireEvent.click(bedtimeBtn);
      expect(bedtimeBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('2. Story Follow-up & 1-Year Later Timeline Component', () => {
    it('renders follow-up timeline milestones with verified badges', () => {
      render(<StoryTimelineUpdates dogName="Bella" />);

      expect(screen.getByText(/Bella's Life Today: Follow-Up Updates/i)).toBeInTheDocument();
      expect(screen.getByText(/6 Months Later Update/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Year Anniversary/i)).toBeInTheDocument();
      expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
    });

    it('returns null gracefully when no updates exist for unknown dog', () => {
      const { container } = render(<StoryTimelineUpdates dogName="UnknownDog" updates={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('3. Transactional Email Dispatch Service', () => {
    it('dispatches welcome newsletter email and returns success result', async () => {
      const result = await EmailService.sendWelcomeNewsletterEmail('reader@example.com');
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('dispatches story submission confirmation email with ticket code', async () => {
      const result = await EmailService.sendStorySubmissionConfirmation(
        'amanda@example.com',
        'Amanda Roberts',
        'Pete',
        'SUB-2026-0818-ABCD'
      );
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('4. Cloud Media Storage & Privacy Pipeline', () => {
    it('validates allowed image MIME types (JPEG, PNG, WebP, AVIF)', () => {
      const validFile = new File(['dummy content'], 'dog.webp', { type: 'image/webp' });
      const validation = StorageService.validateImageFile(validFile);
      expect(validation.valid).toBe(true);
    });

    it('rejects unpermitted file extensions and MIME types (PDF, EXE)', () => {
      const invalidFile = new File(['dummy content'], 'doc.pdf', { type: 'application/pdf' });
      const validation = StorageService.validateImageFile(invalidFile);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Invalid file type');
    });

    it('rejects files larger than 5MB', () => {
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const largeFile = new File([largeContent], 'large-dog.jpg', { type: 'image/jpeg' });
      const validation = StorageService.validateImageFile(largeFile);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('exceeds 5MB limit');
    });
  });

  describe('5. Spanish Localization (i18n) Dictionary', () => {
    it('contains all required navigation and trust keys in Spanish', () => {
      expect(ES_TRANSLATIONS.brand).toBe('Eternal Paws en Español');
      expect(ES_TRANSLATIONS.nav.reunions).toBe('Reencuentros');
      expect(ES_TRANSLATIONS.nav.heroDogs).toBe('Perros Héroes');
      expect(ES_TRANSLATIONS.trust.stronglyVerified).toBe('Altamente Verificado');
      expect(ES_TRANSLATIONS.engagement.joinPack).toBe('Unirse a la Manada');
    });
  });

  describe('6. First-Party Analytics Event Tracker', () => {
    it('tracks custom events without throwing errors', () => {
      expect(() => {
        AnalyticsTracker.trackStoryView('bella-blind-beagle', 'Bella', 'rescues');
        AnalyticsTracker.trackScrollDepth('bella-blind-beagle', 75);
        AnalyticsTracker.trackShare('bella-blind-beagle', 'facebook');
      }).not.toThrow();
    });
  });
});
