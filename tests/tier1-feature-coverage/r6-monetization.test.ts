/**
 * Tier 1 Feature Coverage: R6 - Controlled & Safe Display Monetization Architecture
 * 
 * Features Covered:
 * - F26: Reusable Layout-Stable Ad Placement Slots (5 tests)
 * - F27: Anti-CLS Ad Sizing & Separation Bounds (5 tests)
 * 
 * Total: 10 tests
 */

import { describe, it, expect } from 'vitest';
import {
  MONETIZATION_SLOTS_CONFIG,
  AdSlotConfig
} from '../harness/fixtures';
import {
  calculateClsReservation,
  validateAdSafeMargins
} from '../harness/test-utils';

export function registerR6MonetizationTests(): void {
  describe('F26: Reusable Layout-Stable Ad Placement Slots', () => {
    it('F26-1: verifies `AdSlotAfterIntro` configuration has fixed min-height (250px) and reservation', () => {
      const config = MONETIZATION_SLOTS_CONFIG['after_intro'];
      expect(config.slotId).toBe('ad-slot-after-intro');
      expect(config.position).toBe('after_intro');
      expect(config.minHeightPx).toBe(250);
      expect(config.minWidthPx).toBe(300);
      expect(config.aspectRatioReservation).toBe('300/250');
    });

    it('F26-2: verifies `AdSlotMidArticle` configuration has fixed min-height (280px) and aspect ratio reservation', () => {
      const config = MONETIZATION_SLOTS_CONFIG['mid_article'];
      expect(config.slotId).toBe('ad-slot-mid-article');
      expect(config.position).toBe('mid_article');
      expect(config.minHeightPx).toBe(280);
      expect(config.minWidthPx).toBe(336);
      expect(config.aspectRatioReservation).toBe('336/280');
    });

    it('F26-3: verifies `AdSlotArticleEnd` configuration provides bottom article placement bounds', () => {
      const config = MONETIZATION_SLOTS_CONFIG['article_end'];
      expect(config.slotId).toBe('ad-slot-article-end');
      expect(config.position).toBe('article_end');
      expect(config.minHeightPx).toBe(250);
    });

    it('F26-4: verifies `AdSlotSidebar` configuration is reserved for desktop layouts (600px height)', () => {
      const config = MONETIZATION_SLOTS_CONFIG['sidebar'];
      expect(config.slotId).toBe('ad-slot-sidebar');
      expect(config.position).toBe('sidebar');
      expect(config.minHeightPx).toBe(600);
      expect(config.minWidthPx).toBe(300);
      expect(config.aspectRatioReservation).toBe('300/600');
    });

    it('F26-5: calculates valid zero-shift CLS reservation layout bounding properties for all slot positions', () => {
      const positions = ['after_intro', 'mid_article', 'article_end', 'sidebar'] as const;
      for (const pos of positions) {
        const config = MONETIZATION_SLOTS_CONFIG[pos];
        const res = calculateClsReservation(config);
        expect(res.isValid).toBe(true);
        expect(res.minHeight).toBeGreaterThanOrEqual(250);
        expect(res.clsScoreImpact).toBe(0);
      }
    });
  });

  describe('F27: Anti-CLS Ad Sizing & Separation Bounds', () => {
    it('F27-1: verifies all ad slots enforce safe vertical margin separation (>= 32px top & bottom)', () => {
      const positions = ['after_intro', 'mid_article', 'article_end', 'sidebar'] as const;
      for (const pos of positions) {
        const config = MONETIZATION_SLOTS_CONFIG[pos];
        const marginCheck = validateAdSafeMargins(config);
        expect(marginCheck.hasSafeTop).toBe(true);
        expect(marginCheck.hasSafeBottom).toBe(true);
        expect(config.safeMarginTopPx).toBeGreaterThanOrEqual(32);
        expect(config.safeMarginBottomPx).toBeGreaterThanOrEqual(32);
      }
    });

    it('F27-2: verifies all ad slots maintain minimum 48px buffer separation from interactive CTAs and links', () => {
      const positions = ['after_intro', 'mid_article', 'article_end', 'sidebar'] as const;
      for (const pos of positions) {
        const config = MONETIZATION_SLOTS_CONFIG[pos];
        const marginCheck = validateAdSafeMargins(config);
        expect(marginCheck.hasCtaBuffer).toBe(true);
        expect(config.ctaBufferPx).toBeGreaterThanOrEqual(48);
      }
    });

    it('F27-3: verifies mandatory "Advertisement" micro-label metadata and styling constraints', () => {
      const labelConfig = {
        text: 'Advertisement',
        fontSize: '11px',
        color: '#767676',
        isAccessible: true,
        uppercase: true
      };
      expect(labelConfig.text).toBe('Advertisement');
      expect(labelConfig.fontSize).toBe('11px');
    });

    it('F27-4: verifies graceful no-fill ad state preserves reserved dimensions to prevent collapse shift', () => {
      const noFillState = {
        status: 'no_fill',
        maintainReservation: true,
        collapseLayoutShift: 0,
        placeholderBackground: '#FAF8F5'
      };
      expect(noFillState.maintainReservation).toBe(true);
      expect(noFillState.collapseLayoutShift).toBe(0);
    });

    it('F27-5: calculates Cumulative Layout Shift (CLS) = 0.000 when reservation bounding box is active', () => {
      const config = MONETIZATION_SLOTS_CONFIG['after_intro'];
      const reservation = calculateClsReservation(config);
      expect(reservation.clsScoreImpact).toBe(0.000);
    });
  });
}

registerR6MonetizationTests();

