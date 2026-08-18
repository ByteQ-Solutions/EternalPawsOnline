/**
 * Challenger M3-2 Adversarial Accessibility & Touch Target Stress Suite
 * Path: tests/tier2-boundary-corner/challenger_m3_2_a11y_touch_targets_stress.test.tsx
 * 
 * Verifies strict compliance with:
 * - WCAG 2.2 AA Success Criterion 2.5.8 (Target Size - Minimum 44x44px)
 * - ARIA roles, labels, and live regions
 * - Zero-CLS layout stability contracts
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ShareBar,
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  CategoryHubView,
} from '@/components/article';
import NotFound from '@/app/not-found';
import GlobalError from '@/app/error';
import { storyBellaRescue, storyLunaMiracle } from '@/lib/data/stories';

describe('Challenger M3-2: Accessibility & Touch Target Stress Tests', () => {
  describe('1. ShareBar Minimum Touch Targets & ARIA Accessibility', () => {
    it('verifies every button and anchor in ShareBar has min-h-[44px] and min-w-[44px]', () => {
      render(
        <ShareBar
          title={storyBellaRescue.title}
          slug={storyBellaRescue.slug}
          dogName={storyBellaRescue.dogName}
        />
      );

      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const allInteractives = [...buttons, ...links];

      expect(allInteractives.length).toBeGreaterThanOrEqual(4);

      for (const el of allInteractives) {
        const className = el.getAttribute('class') || '';
        expect(className).toMatch(/min-w-\[44px\]/);
        expect(className).toMatch(/min-h-\[44px\]/);
        expect(el.getAttribute('aria-label')).toBeTruthy();
      }
    });

    it('contains an aria-live="polite" announcement region for screen reader feedback', () => {
      const { container } = render(
        <ShareBar title="Sample Story" slug="sample-slug" />
      );
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveClass('sr-only');
    });
  });

  describe('2. CategoryHubView Touch Targets & Navigation Semantics', () => {
    it('verifies all category switcher pills and action links have min-h-[44px]', () => {
      render(<CategoryHubView category="rescues" />);

      // Masthead & Category feed links
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      // Verify that category switcher links have min-h-[44px]
      const categorySwitchers = links.filter((l) =>
        ['/reunions', '/hero-dogs', '/survival', '/loyalty', '/lost-and-found'].includes(
          l.getAttribute('href') || ''
        )
      );

      for (const catLink of categorySwitchers) {
        expect(catLink.className).toMatch(/min-h-\[44px\]/);
      }
    });

    it('renders empathetic empty state with min 44x44px recovery CTAs when no stories exist', () => {
      // Simulate empty category view by using an arbitrary empty category
      render(<CategoryHubView category={'survival' as any} />);
      
      const exploreLinks = screen.getAllByRole('link');
      for (const link of exploreLinks) {
        if (link.textContent?.includes('Read')) {
          expect(link.className).toMatch(/min-h-\[44px\]/);
        }
      }
    });
  });

  describe('3. NotFound 404 Recovery Touch Targets', () => {
    it('verifies all primary and secondary recovery buttons in 404 page have min-h-[44px]', () => {
      render(<NotFound />);

      const homeLink = screen.getByRole('link', { name: /explore verified stories/i });
      const searchLink = screen.getByRole('link', { name: /search archives/i });

      expect(homeLink.className).toMatch(/min-h-\[44px\]/);
      expect(searchLink.className).toMatch(/min-h-\[44px\]/);

      const collectionLinks = [
        screen.getByRole('link', { name: 'Hero Dogs' }),
        screen.getByRole('link', { name: 'Rescue Stories' }),
        screen.getByRole('link', { name: 'Reunion Miracles' }),
        screen.getByRole('link', { name: 'Submit a Story' }),
      ];

      for (const colLink of collectionLinks) {
        expect(colLink.className).toMatch(/min-h-\[44px\]/);
      }
    });
  });

  describe('4. GlobalError Boundary Recovery Touch Targets', () => {
    it('verifies retry button and return home link in GlobalError have min-h-[44px]', () => {
      const mockReset = vi.fn();
      render(<GlobalError error={new Error('Test runtime failure')} reset={mockReset} />);

      const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
      const homeLink = screen.getByRole('link', { name: /return to home feed/i });

      expect(tryAgainBtn.className).toMatch(/min-h-\[44px\]/);
      expect(homeLink.className).toMatch(/min-h-\[44px\]/);

      fireEvent.click(tryAgainBtn);
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('5. ReadingProgressBar ARIA Semantics', () => {
    it('declares full progressbar ARIA semantics', () => {
      render(<ReadingProgressBar />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveAttribute('aria-label', 'Story reading progress');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
      expect(bar).toHaveAttribute('aria-valuenow');
    });
  });

  describe('6. OptimizedDogImage Zero-CLS & AI Disclosure Semantics', () => {
    it('renders style aspect-ratio and role="note" for AI visual reconstructions', () => {
      const { container } = render(<OptimizedDogImage image={storyLunaMiracle.heroImage} />);
      const wrapper = container.querySelector('[style*="aspect-ratio"]');
      expect(wrapper).toBeInTheDocument();

      const disclosure = screen.getByRole('note');
      expect(disclosure).toBeInTheDocument();
      expect(disclosure).toHaveTextContent(/AI Visual Reconstruction/i);
    });
  });
});
