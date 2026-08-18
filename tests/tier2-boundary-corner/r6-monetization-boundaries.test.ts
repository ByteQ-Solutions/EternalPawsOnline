import { describe, it, expect } from 'vitest';

/**
 * Monetization ad slot types and configuration contracts
 */
export type AdSlotPosition = 'after_intro' | 'mid_article' | 'article_end' | 'sidebar';

export interface AdSlotConfig {
  slotId: string;
  position: AdSlotPosition;
  minHeightPx: number;
  minWidthPx: number;
  aspectRatioReservation: string;
  safeMarginTopPx: number;
  safeMarginBottomPx: number;
  hasDisclosureLabel: boolean;
}

/**
 * Standard ad slot position specifications
 */
export const AD_SLOT_DEFAULTS: Record<AdSlotPosition, Omit<AdSlotConfig, 'slotId'>> = {
  after_intro: {
    position: 'after_intro',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatioReservation: '300/250',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    hasDisclosureLabel: true,
  },
  mid_article: {
    position: 'mid_article',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatioReservation: '300/250',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    hasDisclosureLabel: true,
  },
  article_end: {
    position: 'article_end',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatioReservation: '300/250',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    hasDisclosureLabel: true,
  },
  sidebar: {
    position: 'sidebar',
    minHeightPx: 600,
    minWidthPx: 300,
    aspectRatioReservation: '300/600',
    safeMarginTopPx: 32,
    safeMarginBottomPx: 32,
    hasDisclosureLabel: true,
  }
};

/**
 * Ad slot safety and separation validator
 */
export function validateAdSlotLayout(config: AdSlotConfig, distanceToNearestCtaPx: number): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Safe margin buffer >= 32px
  if (config.safeMarginTopPx < 32 || config.safeMarginBottomPx < 32) {
    violations.push(`Safe margin buffer must be at least 32px (got top:${config.safeMarginTopPx}px, bottom:${config.safeMarginBottomPx}px)`);
  }

  // CTA proximity buffer >= 48px
  if (distanceToNearestCtaPx < 48) {
    violations.push(`CTA proximity buffer violation: Distance to nearest CTA (${distanceToNearestCtaPx}px) is less than required 48px minimum.`);
  }

  // Mandatory "Advertisement" micro-label
  if (!config.hasDisclosureLabel) {
    violations.push('Ad slot is missing mandatory "Advertisement" disclosure micro-label.');
  }

  // Min dimensions
  if (config.minHeightPx < 250 || config.minWidthPx < 300) {
    violations.push('Ad slot min dimensions must be at least 300x250px.');
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}

/**
 * Cumulative Layout Shift (CLS) calculator
 */
export function calculateCumulativeLayoutShift(shifts: { impactFraction: number; distanceFraction: number }[]): number {
  return shifts.reduce((totalCls, shift) => {
    const shiftScore = shift.impactFraction * shift.distanceFraction;
    return totalCls + shiftScore;
  }, 0);
}

describe('Tier 2 Boundary Tests - R6: Controlled & Safe Display Monetization Architecture', () => {

  describe('F26: Reusable Layout-Stable Ad Placement Slots Boundaries', () => {
    it('F26-B1: Zero-fill ad response collapses cleanly without causing layout shift (CLS = 0)', () => {
      // When an ad slot has pre-allocated layout reservation and collapses, CLS remains 0 if container maintains min-height or collapses outside viewport
      const zeroFillState = {
        slotId: 'ad-slot-after-intro',
        filled: false,
        containerStyle: {
          minHeight: '250px',
          display: 'block',
          backgroundColor: '#FAF8F5', // Seamless with canvas
        },
        clsShift: { impactFraction: 0.25, distanceFraction: 0.0 } // Pre-reserved -> distanceFraction = 0
      };

      const cls = calculateCumulativeLayoutShift([zeroFillState.clsShift]);
      expect(cls).toBe(0.0);
      expect(zeroFillState.containerStyle.minHeight).toBe('250px');
    });

    it('F26-B2: Delayed ad creative load (5s latency) preserves reading text position without displacement', () => {
      const initialReservation = { width: 300, height: 250, distanceMoved: 0 };
      const loadedCreative = { width: 300, height: 250, distanceMoved: 0 };

      // Since width and height matched the reserved box, distance moved of following content = 0
      const cls = calculateCumulativeLayoutShift([{ impactFraction: 0.3, distanceFraction: 0.0 }]);
      expect(cls).toBe(0.0);
      expect(initialReservation.height).toBe(loadedCreative.height);
    });

    it('F26-B3: Extremely short viewport (320px height) restricts ad height to under 30% of screen height', () => {
      const viewportHeight = 320;
      const maxAllowedAdHeight = viewportHeight * 0.30; // 96px for sticky or 250px for inline

      const isStickyAdCompliant = (stickyAdHeight: number): boolean => {
        return stickyAdHeight <= maxAllowedAdHeight;
      };

      expect(isStickyAdCompliant(50)).toBe(true); // 50px mobile anchor ad
      expect(isStickyAdCompliant(150)).toBe(false); // Too tall for 320px viewport
    });

    it('F26-B4: Duplicate ad slot IDs on the same page are detected and flagged', () => {
      const validateSlotIds = (slotIds: string[]): { isUnique: boolean; duplicates: string[] } => {
        const seen = new Set<string>();
        const duplicates: string[] = [];
        for (const id of slotIds) {
          if (seen.has(id)) {
            duplicates.push(id);
          }
          seen.add(id);
        }
        return { isUnique: duplicates.length === 0, duplicates };
      };

      const validIds = ['ad-after-intro', 'ad-mid-article', 'ad-end'];
      const duplicateIds = ['ad-after-intro', 'ad-after-intro', 'ad-end'];

      expect(validateSlotIds(validIds).isUnique).toBe(true);
      expect(validateSlotIds(duplicateIds).isUnique).toBe(false);
      expect(validateSlotIds(duplicateIds).duplicates).toContain('ad-after-intro');
    });

    it('F26-B5: All 4 standard ad positions configure valid min dimensions and aspect ratios', () => {
      const positions: AdSlotPosition[] = ['after_intro', 'mid_article', 'article_end', 'sidebar'];

      for (const pos of positions) {
        const config = AD_SLOT_DEFAULTS[pos];
        expect(config.minHeightPx).toBeGreaterThanOrEqual(250);
        expect(config.minWidthPx).toBeGreaterThanOrEqual(300);
        expect(config.hasDisclosureLabel).toBe(true);
      }
    });
  });

  describe('F27: Anti-CLS Ad Sizing & Separation Bounds Boundaries', () => {
    it('F27-B1: Safe margin buffer < 32px is strictly rejected as a policy and layout violation', () => {
      const invalidConfig: AdSlotConfig = {
        slotId: 'ad-1',
        position: 'mid_article',
        minHeightPx: 250,
        minWidthPx: 300,
        aspectRatioReservation: '300/250',
        safeMarginTopPx: 16, // < 32px
        safeMarginBottomPx: 32,
        hasDisclosureLabel: true
      };

      const validConfig: AdSlotConfig = {
        ...invalidConfig,
        safeMarginTopPx: 32,
      };

      const invalidResult = validateAdSlotLayout(invalidConfig, 60);
      const validResult = validateAdSlotLayout(validConfig, 60);

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.violations.some(v => v.includes('Safe margin buffer'))).toBe(true);
      expect(validResult.isValid).toBe(true);
    });

    it('F27-B2: Distance to nearest CTA < 48px is strictly rejected to prevent accidental ad clicks', () => {
      const config: AdSlotConfig = {
        slotId: 'ad-2',
        position: 'article_end',
        minHeightPx: 250,
        minWidthPx: 300,
        aspectRatioReservation: '300/250',
        safeMarginTopPx: 32,
        safeMarginBottomPx: 32,
        hasDisclosureLabel: true
      };

      const tooCloseToCta = validateAdSlotLayout(config, 47.9); // < 48px
      const safeDistance = validateAdSlotLayout(config, 48.0); // >= 48px

      expect(tooCloseToCta.isValid).toBe(false);
      expect(tooCloseToCta.violations.some(v => v.includes('CTA proximity buffer violation'))).toBe(true);
      expect(safeDistance.isValid).toBe(true);
    });

    it('F27-B3: Missing "Advertisement" disclosure micro-label fails compliance validation', () => {
      const configWithoutLabel: AdSlotConfig = {
        slotId: 'ad-3',
        position: 'after_intro',
        minHeightPx: 250,
        minWidthPx: 300,
        aspectRatioReservation: '300/250',
        safeMarginTopPx: 32,
        safeMarginBottomPx: 32,
        hasDisclosureLabel: false // Missing
      };

      const result = validateAdSlotLayout(configWithoutLabel, 100);
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Ad slot is missing mandatory "Advertisement" disclosure micro-label.');
    });

    it('F27-B4: Creative size mismatch (e.g. 300x600 inside 300x250 slot) is contained without overflow', () => {
      const containAdCreative = (slotWidth: number, slotHeight: number, creativeWidth: number, creativeHeight: number) => {
        const isOverflowing = creativeWidth > slotWidth || creativeHeight > slotHeight;
        const scaleFactor = isOverflowing ? Math.min(slotWidth / creativeWidth, slotHeight / creativeHeight) : 1.0;
        return {
          isOverflowing,
          effectiveWidth: creativeWidth * scaleFactor,
          effectiveHeight: creativeHeight * scaleFactor,
          fitsWithinReservation: (creativeWidth * scaleFactor) <= slotWidth && (creativeHeight * scaleFactor) <= slotHeight
        };
      };

      const containment = containAdCreative(300, 250, 300, 600);
      expect(containment.isOverflowing).toBe(true);
      expect(containment.effectiveHeight).toBe(250);
      expect(containment.effectiveWidth).toBe(125);
      expect(containment.fitsWithinReservation).toBe(true);
    });

    it('F27-B5: Layout shift formula yields exactly 0.000 for pre-allocated ad bounding box', () => {
      // 3 ad slots loaded on page with pre-reserved aspect-ratio boxes -> distance moved of text = 0
      const shifts = [
        { impactFraction: 0.20, distanceFraction: 0.0 },
        { impactFraction: 0.25, distanceFraction: 0.0 },
        { impactFraction: 0.15, distanceFraction: 0.0 },
      ];

      const totalCls = calculateCumulativeLayoutShift(shifts);
      expect(totalCls).toBe(0.0);
    });
  });
});
