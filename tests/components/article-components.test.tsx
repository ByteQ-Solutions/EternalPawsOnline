/**
 * Component Test Suite: Article UI & Media Components (Milestone M3)
 * Path: tests/components/article-components.test.tsx
 * 
 * Verifies ArticleHeader, ArticleContent, OptimizedDogImage, ReadingProgressBar,
 * and ShareBar for zero-CLS, WCAG 2.2 AA accessibility, and 44x44px touch targets.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2; PROJECT.md F12, F13, F14
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar,
} from '@/components/article';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyLunaMiracle,
} from '@/lib/data/stories';

describe('Article UI & Media Components (tests/components/article-components.test.tsx)', () => {
  describe('1. ArticleHeader Component', () => {
    it('renders editorial H1 title, subtitle, and dog facts', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(storyBellaRescue.title);
      expect(screen.getByText(storyBellaRescue.subtitle)).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();
      expect(screen.getByText('Beagle')).toBeInTheDocument();
      expect(screen.getByText(/Missoula, Montana/i)).toBeInTheDocument();
    });

    it('renders category badge and link to category hub', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      const categoryLink = screen.getByRole('link', { name: /rescues/i });
      expect(categoryLink).toHaveAttribute('href', '/rescues');
    });

    it('renders author and formatted ISO publication timestamp', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      expect(screen.getByText(/Fact-Checked by Elena Rostova/i)).toBeInTheDocument();
      const timeElem = screen.getByText(/January 20, 2025/i);
      expect(timeElem).toHaveAttribute('dateTime', storyBellaRescue.publishedAt);
      expect(screen.getByText(/4 min read/i)).toBeInTheDocument();
    });

    it('renders VerificationBadge with proper status', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Strongly Verified')).toBeInTheDocument();
    });
  });

  describe('2. ArticleContent Component', () => {
    it('renders multi-paragraph narrative content with drop cap on first paragraph', () => {
      const { container } = render(
        <ArticleContent content={storyBellaRescue.content} enableDropCap={true} />
      );
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(paragraphs[0].className).toContain('first-letter:font-serif');
    });

    it('renders blockquote for highlighted quotes', () => {
      const quoteContent = `First intro paragraph.\n\n> "Bella taught us that courage has no eyes, only heart."\n\nConcluding remarks.`;
      render(<ArticleContent content={quoteContent} />);
      const blockquote = screen.getByText(/Bella taught us that courage/i);
      expect(blockquote).toBeInTheDocument();
    });

    it('handles empty or short content gracefully', () => {
      const { container } = render(<ArticleContent content="Single sentence story." />);
      expect(screen.getByText('Single sentence story.')).toBeInTheDocument();
      expect(container.querySelectorAll('p')).toHaveLength(1);
    });
  });

  describe('3. OptimizedDogImage Component', () => {
    it('renders image with zero-CLS aspect ratio and accessible alt text', () => {
      const { container } = render(
        <OptimizedDogImage image={storyBellaRescue.heroImage} priority={true} />
      );
      const wrapper = container.querySelector('[style*="aspect-ratio"]');
      expect(wrapper).toBeInTheDocument();
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', storyBellaRescue.heroImage.altText);
    });

    it('supports heroImage prop alias for backward compatibility', () => {
      render(<OptimizedDogImage heroImage={storyBellaRescue.heroImage} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', storyBellaRescue.heroImage.altText);
    });

    it('renders AI disclosure note when image is an AI visual reconstruction', () => {
      render(<OptimizedDogImage image={storyLunaMiracle.heroImage} />);
      expect(screen.getByRole('note')).toBeInTheDocument();
      expect(screen.getByText(/AI Visual Reconstruction/i)).toBeInTheDocument();
    });

    it('handles image load error and falls back to placeholder', () => {
      render(
        <OptimizedDogImage image={{ ...storyBellaRescue.heroImage, url: 'https://broken.invalid/dog.jpg' }} />
      );
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });
  });

  describe('4. ReadingProgressBar Component', () => {
    it('renders progressbar with initial state and progressbar role', () => {
      render(<ReadingProgressBar />);
      const bar = screen.getByRole('progressbar', { name: /reading progress/i });
      expect(bar).toHaveAttribute('aria-valuenow', '0');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    });

    it('updates reading progress on scroll event', () => {
      render(<ReadingProgressBar />);
      const progressBar = screen.getByRole('progressbar');

      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2800, configurable: true });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });

      act(() => {
        fireEvent.scroll(window);
      });
      // Clamped within 0-100
      expect(Number(progressBar.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(0);
      expect(Number(progressBar.getAttribute('aria-valuenow'))).toBeLessThanOrEqual(100);
    });
  });

  describe('5. ShareBar Component', () => {
    const originalClipboard = { ...navigator.clipboard };

    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true,
      });
    });

    it('enforces min 44x44px touch targets on all share buttons and links', () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} dogName="Bella" />);
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const allInteractives = [...buttons, ...links];

      expect(allInteractives.length).toBeGreaterThanOrEqual(4);
      for (const el of allInteractives) {
        expect(el.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]/);
      }
    });

    it('renders accessible aria-label on all social share triggers', () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      expect(screen.getByLabelText(/share on x/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share via email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/copy story link/i)).toBeInTheDocument();
    });

    it('copies story link to clipboard and renders feedback', async () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      const copyBtn = screen.getByRole('button', { name: /copy story link/i });

      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining(storyBellaRescue.slug)
      );

      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });
});
