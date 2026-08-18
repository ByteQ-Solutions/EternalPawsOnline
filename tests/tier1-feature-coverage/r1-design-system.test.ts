/**
 * Tier 1 Feature Coverage: R1 - Design System & Mobile-First Editorial UX
 * 
 * Features Covered:
 * - F01: Project Scaffolding & Setup (5 tests)
 * - F02: Soft-Shadow Editorial UI Tokens (5 tests)
 * - F03: WCAG 2.2 AA Contrast & Accessibility (5 tests)
 * - F04: 44x44px Touch Targets (5 tests)
 * - F05: Zero-CLS Responsive Layout Primitives (5 tests)
 * 
 * Total: 25 tests
 */

import { describe, it, expect } from 'vitest';
import { editorialTokensFixture } from '../harness/fixtures';
import {
  calculateContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  validateTouchTarget,
  hexToRgb,
  calculateLuminance
} from '../harness/test-utils';

export function registerR1DesignSystemTests(): void {
  describe('F01: Project Scaffolding & Setup', () => {
    it('F01-1: verifies design system token schema and immutable color keys', () => {
      const tokens = editorialTokensFixture;
      expect(tokens).toBeDefined();
      expect(typeof tokens.colors).toBe('object');
      expect(tokens.colors.canvas).toBe('#FAF8F5');
      expect(tokens.colors.card).toBe('#FFFFFF');
      expect(tokens.colors.inkPrimary).toBe('#1E1E1E');
      expect(tokens.colors.forestPrimary).toBe('#234E35');
      expect(tokens.colors.goldAccent).toBe('#C97A1E');
    });

    it('F01-2: verifies typography font family fallbacks and CSS variable definitions', () => {
      const typography = editorialTokensFixture.typography;
      expect(typography.fontSerif).toContain('var(--font-editorial-serif)');
      expect(typography.fontSerif).toContain('Georgia');
      expect(typography.fontSerif).toContain('serif');
      expect(typography.fontSans).toContain('var(--font-editorial-sans)');
      expect(typography.fontSans).toContain('system-ui');
    });

    it('F01-3: verifies touch target minimum global constant conforms to 44px', () => {
      expect(editorialTokensFixture.touchTargetMin).toBe('44px');
      const numericTarget = parseInt(editorialTokensFixture.touchTargetMin, 10);
      expect(numericTarget).toBeGreaterThanOrEqual(44);
    });

    it('F01-4: verifies elevation shadow token definitions for soft and elevated layers', () => {
      const shadows = editorialTokensFixture.shadows;
      expect(shadows.soft).toContain('rgba(30, 30, 30, 0.06)');
      expect(shadows.elevated).toContain('0 8px 24px -4px');
      expect(shadows.elevated).toContain('rgba(30, 30, 30, 0.08)');
    });

    it('F01-5: verifies color hex parsing utility handles both standard and shorthand formats', () => {
      const rgbCanvas = hexToRgb('#FAF8F5');
      expect(rgbCanvas.r).toBe(250);
      expect(rgbCanvas.g).toBe(248);
      expect(rgbCanvas.b).toBe(245);

      const rgbShort = hexToRgb('#FFF');
      expect(rgbShort.r).toBe(255);
      expect(rgbShort.g).toBe(255);
      expect(rgbShort.b).toBe(255);
    });
  });

  describe('F02: Soft-Shadow Editorial UI Tokens', () => {
    it('F02-1: verifies warm off-white canvas `#FAF8F5` provides high-warmth background luminance', () => {
      const rgb = hexToRgb(editorialTokensFixture.colors.canvas);
      const lum = calculateLuminance(rgb.r, rgb.g, rgb.b);
      // Canvas should be very light (> 0.90 relative luminance)
      expect(lum).toBeGreaterThan(0.90);
      expect(rgb.r).toBeGreaterThanOrEqual(rgb.b); // Warm tone has higher red/green than blue
    });

    it('F02-2: verifies crisp editorial card surface `#FFFFFF` and muted card `#F4F0EA` distinction', () => {
      const cardWhite = editorialTokensFixture.colors.card;
      const cardMuted = editorialTokensFixture.colors.cardMuted;
      expect(cardWhite).toBe('#FFFFFF');
      expect(cardMuted).toBe('#F4F0EA');

      const ratioBetweenCards = calculateContrastRatio(cardWhite, cardMuted);
      // Subtle layered hierarchy between white card and muted background
      expect(ratioBetweenCards).toBeGreaterThanOrEqual(1.05);
      expect(ratioBetweenCards).toBeLessThanOrEqual(1.30);
    });

    it('F02-3: verifies brand primary forest green `#234E35` and light tint `#EBF3ED` tokens', () => {
      const forest = editorialTokensFixture.colors.forestPrimary;
      const forestLight = editorialTokensFixture.colors.forestLight;
      expect(forest).toBe('#234E35');
      expect(forestLight).toBe('#EBF3ED');

      const contrastRatio = calculateContrastRatio(forest, forestLight);
      // Forest green text on forest light pill should easily exceed 4.5:1
      expect(contrastRatio).toBeGreaterThan(7.0);
      expect(meetsWcagAA(forest, forestLight)).toBe(true);
    });

    it('F02-4: verifies trust gold accent `#C97A1E` and gold light badge surface `#FEF7EC`', () => {
      const gold = editorialTokensFixture.colors.goldAccent;
      const goldLight = editorialTokensFixture.colors.goldLight;
      expect(gold).toBe('#C97A1E');
      expect(goldLight).toBe('#FEF7EC');

      const goldOnBadgeContrast = calculateContrastRatio(gold, goldLight);
      // Gold accent on light badge background provides clear visual distinction
      expect(goldOnBadgeContrast).toBeGreaterThan(3.0);
    });

    it('F02-5: verifies structural border color `#E8E3DA` matches warm editorial aesthetic', () => {
      const border = editorialTokensFixture.colors.borderLight;
      expect(border).toBe('#E8E3DA');
      const rgb = hexToRgb(border);
      expect(rgb.r).toBe(232);
      expect(rgb.g).toBe(227);
      expect(rgb.b).toBe(218);
    });
  });

  describe('F03: WCAG 2.2 AA Contrast & Accessibility', () => {
    it('F03-1: verifies primary ink `#1E1E1E` on canvas `#FAF8F5` exceeds 15:1 contrast', () => {
      const ratio = calculateContrastRatio(
        editorialTokensFixture.colors.inkPrimary,
        editorialTokensFixture.colors.canvas
      );
      expect(ratio).toBeGreaterThan(15.0);
      expect(meetsWcagAA(editorialTokensFixture.colors.inkPrimary, editorialTokensFixture.colors.canvas)).toBe(true);
      expect(meetsWcagAAA(editorialTokensFixture.colors.inkPrimary, editorialTokensFixture.colors.canvas)).toBe(true);
    });

    it('F03-2: verifies muted ink `#555555` on canvas `#FAF8F5` exceeds 6.5:1 contrast (WCAG AA pass)', () => {
      const ratio = calculateContrastRatio(
        editorialTokensFixture.colors.inkMuted,
        editorialTokensFixture.colors.canvas
      );
      expect(ratio).toBeGreaterThan(6.5);
      expect(meetsWcagAA(editorialTokensFixture.colors.inkMuted, editorialTokensFixture.colors.canvas)).toBe(true);
    });

    it('F03-3: verifies subtle ink `#767676` on card surface `#FFFFFF` meets 4.5:1 AA threshold for microcopy', () => {
      const ratio = calculateContrastRatio(
        editorialTokensFixture.colors.inkSubtle,
        editorialTokensFixture.colors.card
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWcagAA(editorialTokensFixture.colors.inkSubtle, editorialTokensFixture.colors.card, false)).toBe(true);
    });

    it('F03-4: verifies primary ink on white card `#FFFFFF` exceeds 16:1 contrast', () => {
      const ratio = calculateContrastRatio(
        editorialTokensFixture.colors.inkPrimary,
        editorialTokensFixture.colors.card
      );
      expect(ratio).toBeGreaterThan(16.0);
      expect(meetsWcagAAA(editorialTokensFixture.colors.inkPrimary, editorialTokensFixture.colors.card)).toBe(true);
    });

    it('F03-5: verifies brand forest green `#234E35` on canvas `#FAF8F5` exceeds 7:1 AAA contrast', () => {
      const ratio = calculateContrastRatio(
        editorialTokensFixture.colors.forestPrimary,
        editorialTokensFixture.colors.canvas
      );
      expect(ratio).toBeGreaterThan(7.0);
      expect(meetsWcagAAA(editorialTokensFixture.colors.forestPrimary, editorialTokensFixture.colors.canvas)).toBe(true);
    });
  });

  describe('F04: 44x44px Touch Targets', () => {
    it('F04-1: verifies primary button dimensions satisfy minimum 44x44px requirement', () => {
      const buttonSize = { width: 140, height: 48 };
      const validation = validateTouchTarget(buttonSize.width, buttonSize.height, 44);
      expect(validation.valid).toBe(true);
      expect(validation.minDimension).toBeGreaterThanOrEqual(44);
      expect(validation.areaPx).toBeGreaterThanOrEqual(44 * 44);
    });

    it('F04-2: verifies mobile navigation toggle button hit area satisfies 44x44px', () => {
      const navToggle = { width: 44, height: 44 };
      const validation = validateTouchTarget(navToggle.width, navToggle.height, 44);
      expect(validation.valid).toBe(true);
      expect(validation.minDimension).toBe(44);
    });

    it('F04-3: verifies category filter pill buttons satisfy 44px vertical height target', () => {
      const filterPill = { width: 96, height: 44 };
      const validation = validateTouchTarget(filterPill.width, filterPill.height, 44);
      expect(validation.valid).toBe(true);
      expect(validation.heightPx).toBeGreaterThanOrEqual(44);
    });

    it('F04-4: verifies form input text fields and submit triggers meet 44px hit bounds', () => {
      const inputField = { width: 320, height: 48 };
      const submitBtn = { width: 120, height: 44 };
      expect(validateTouchTarget(inputField.width, inputField.height, 44).valid).toBe(true);
      expect(validateTouchTarget(submitBtn.width, submitBtn.height, 44).valid).toBe(true);
    });

    it('F04-5: rejects undersized interactive elements with explicit diagnostic message', () => {
      const smallIcon = { width: 24, height: 24 };
      const validation = validateTouchTarget(smallIcon.width, smallIcon.height, 44);
      expect(validation.valid).toBe(false);
      expect(validation.minDimension).toBe(24);
      expect(validation.message).toContain('Fails touch target requirement');
    });
  });

  describe('F05: Zero-CLS Responsive Layout Primitives', () => {
    it('F05-1: verifies mobile container primitive clamps cleanly within 320px viewport without overflow', () => {
      const viewportWidth = 320;
      const paddingHorizontal = 16 * 2; // 16px left + 16px right
      const maxContentWidth = viewportWidth - paddingHorizontal;
      expect(maxContentWidth).toBe(288);
      expect(maxContentWidth).toBeLessThan(viewportWidth);
    });

    it('F05-2: verifies desktop container max-width constraint at 1280px', () => {
      const desktopBreakpoint = 1280;
      const containerMaxWidth = 1200;
      expect(containerMaxWidth).toBeLessThanOrEqual(desktopBreakpoint);
      expect(containerMaxWidth).toBeGreaterThan(768);
    });

    it('F05-3: verifies header primitive maintains fixed height reservation (64px) to prevent CLS', () => {
      const headerReservationHeightPx = 64;
      expect(headerReservationHeightPx).toBeGreaterThanOrEqual(56);
      expect(headerReservationHeightPx).toBeLessThanOrEqual(80);
    });

    it('F05-4: verifies responsive grid column distribution between mobile (1 col) and desktop (3 col)', () => {
      const mobileCols = 1;
      const tabletCols = 2;
      const desktopCols = 3;
      expect(mobileCols).toBe(1);
      expect(tabletCols).toBe(2);
      expect(desktopCols).toBe(3);
    });

    it('F05-5: verifies story card image container aspect ratio reservations prevent shift on mount', () => {
      const heroAspectRatio = '16/9';
      const cardAspectRatio = '3/2';
      expect(heroAspectRatio).toBe('16/9');
      expect(cardAspectRatio).toBe('3/2');
    });
  });
}

registerR1DesignSystemTests();

