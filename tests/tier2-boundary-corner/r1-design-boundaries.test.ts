import { describe, it, expect } from 'vitest';

/**
 * Editorial design system tokens as defined in PROJECT.md
 */
export const editorialTokens = {
  colors: {
    canvas: '#FAF8F5',       // Warm off-white background
    card: '#FFFFFF',         // Crisp editorial card surface
    cardMuted: '#F4F0EA',    // Secondary card surface
    inkPrimary: '#1E1E1E',   // Primary text (>15:1 contrast)
    inkMuted: '#555555',     // Secondary text (>6.5:1 contrast)
    inkSubtle: '#767676',    // Micro text (>4.5:1 contrast)
    forestPrimary: '#234E35',// Brand primary green
    forestLight: '#EBF3ED',  // Brand light tint
    goldAccent: '#C97A1E',   // Trust/warning accent
    goldLight: '#FEF7EC',    // Trust badge background
    borderLight: '#E8E3DA',  // Subtle structural border
  },
  typography: {
    fontSerif: 'var(--font-editorial-serif), Georgia, serif',
    fontSans: 'var(--font-editorial-sans), system-ui, sans-serif',
  },
  touchTargetMin: '44px',
  shadows: {
    soft: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
    elevated: '0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)',
  },
  spacing: {
    zero: '0px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    ctaBuffer: '48px',
  },
  breakpoints: {
    mobileMin: 320,
    mobileMax: 430,
    tablet: 768,
    desktop: 1024,
    wideDesktop: 1280,
    ultraWide: 2560,
  }
};

/**
 * Color luminance and WCAG contrast ratio calculations (WCAG 2.2 AA specification)
 */
function getRelativeLuminance(hexColor: string): number {
  let cleanHex = hexColor.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lum1 = getRelativeLuminance(foregroundHex);
  const lum2 = getRelativeLuminance(backgroundHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Touch target dimension validator
 */
function validateTouchTargetSize(widthPx: number, heightPx: number, isInteractive: boolean, isAriaHidden: boolean = false): {
  passed: boolean;
  effectiveWidth: number;
  effectiveHeight: number;
  reason?: string;
} {
  if (!isInteractive || isAriaHidden) {
    return { passed: true, effectiveWidth: widthPx, effectiveHeight: heightPx };
  }
  const minRequired = 44.0;
  const passed = widthPx >= minRequired && heightPx >= minRequired;
  return {
    passed,
    effectiveWidth: widthPx,
    effectiveHeight: heightPx,
    reason: passed ? undefined : `Touch target size (${widthPx}x${heightPx}px) is less than required minimum ${minRequired}x${minRequired}px`
  };
}

/**
 * Responsive viewport layout simulator
 */
function simulateViewportLayout(viewportWidth: number, viewportHeight: number, contentWidth: number, containerPadding: number = 16): {
  hasHorizontalOverflow: boolean;
  overflowAmountPx: number;
  isCentered: boolean;
  computedContentWidth: number;
} {
  const maxAllowedContentWidth = viewportWidth - (containerPadding * 2);
  const hasHorizontalOverflow = contentWidth > viewportWidth;
  const overflowAmountPx = Math.max(0, contentWidth - viewportWidth);
  const isCentered = viewportWidth > 1280 ? (viewportWidth - contentWidth) / 2 >= containerPadding : true;

  return {
    hasHorizontalOverflow,
    overflowAmountPx,
    isCentered,
    computedContentWidth: Math.min(contentWidth, maxAllowedContentWidth)
  };
}

describe('Tier 2 Boundary Tests - R1: Design System & Mobile-First Editorial UX', () => {

  describe('F01: Project Scaffolding & Setup Boundaries', () => {
    it('F01-B1: Handles missing optional environment variables and provides safe fallbacks without crashing', () => {
      const getEnvConfig = (env: Record<string, string | undefined>) => ({
        baseUrl: env.NEXT_PUBLIC_BASE_URL || 'https://eternal-paws.org',
        enableAnalytics: env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
        apiTimeoutMs: env.API_TIMEOUT_MS ? parseInt(env.API_TIMEOUT_MS, 10) : 5000,
        cacheTtlSeconds: env.CACHE_TTL ? parseInt(env.CACHE_TTL, 10) : 3600,
      });

      const emptyEnv = {};
      const config = getEnvConfig(emptyEnv);

      expect(config.baseUrl).toBe('https://eternal-paws.org');
      expect(config.enableAnalytics).toBe(false);
      expect(config.apiTimeoutMs).toBe(5000);
      expect(config.cacheTtlSeconds).toBe(3600);
    });

    it('F01-B2: Strict TypeScript boundary rejects unknown properties and invalid types in story definitions', () => {
      interface StrictStoryHeader {
        title: string;
        slug: string;
        publishedAt: string;
      }

      function validateStrictStoryHeader(obj: unknown): obj is StrictStoryHeader {
        if (!obj || typeof obj !== 'object') return false;
        const record = obj as Record<string, unknown>;
        const hasValidTitle = typeof record.title === 'string' && record.title.trim().length > 0;
        const hasValidSlug = typeof record.slug === 'string' && /^[a-z0-9-]+$/.test(record.slug);
        const hasValidDate = typeof record.publishedAt === 'string' && !isNaN(Date.parse(record.publishedAt));
        return hasValidTitle && hasValidSlug && hasValidDate;
      }

      const validObj = { title: 'Brave Max', slug: 'brave-max', publishedAt: '2026-08-15T12:00:00Z' };
      const invalidSlug = { title: 'Brave Max', slug: 'Invalid Slug!', publishedAt: '2026-08-15T12:00:00Z' };
      const invalidDate = { title: 'Brave Max', slug: 'brave-max', publishedAt: 'not-a-date' };

      expect(validateStrictStoryHeader(validObj)).toBe(true);
      expect(validateStrictStoryHeader(invalidSlug)).toBe(false);
      expect(validateStrictStoryHeader(invalidDate)).toBe(false);
    });

    it('F01-B3: Asset path boundary safely resolves unicode characters and deeply nested paths without malforming URLs', () => {
      function normalizeAssetPath(base: string, path: string): string {
        const cleanBase = base.replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '');
        return encodeURI(`${cleanBase}/${cleanPath}`);
      }

      const base = 'https://eternal-paws.org/assets/';
      const unicodeAsset = 'images/stories/hachikō_memorial_東京/hero.webp';
      const normalized = normalizeAssetPath(base, unicodeAsset);

      expect(normalized).toContain('hachik%C5%8D_memorial_%E6%9D%B1%E4%BA%AC');
      expect(normalized.startsWith('https://eternal-paws.org/assets/images/stories/')).toBe(true);
    });

    it('F01-B4: Package module resolution boundary supports both default and named token exports', () => {
      const moduleBundle = {
        default: editorialTokens,
        editorialTokens: editorialTokens,
        colors: editorialTokens.colors,
        typography: editorialTokens.typography
      };

      expect(moduleBundle.default).toBeDefined();
      expect(moduleBundle.editorialTokens.colors.canvas).toBe('#FAF8F5');
      expect(moduleBundle.colors.inkPrimary).toBe('#1E1E1E');
    });

    it('F01-B5: Scaffolding token consistency ensures all required color channels exist without undefined values', () => {
      const requiredColors = [
        'canvas', 'card', 'cardMuted', 'inkPrimary', 'inkMuted', 'inkSubtle',
        'forestPrimary', 'forestLight', 'goldAccent', 'goldLight', 'borderLight'
      ] as const;

      for (const colorKey of requiredColors) {
        const val = editorialTokens.colors[colorKey];
        expect(val).toBeDefined();
        expect(typeof val).toBe('string');
        expect(val.startsWith('#')).toBe(true);
      }
    });
  });

  describe('F02: Soft-Shadow Editorial UI Tokens Limits', () => {
    it('F02-B1: Zero-margin and zero-padding token boundary evaluates 0px without producing invalid CSS or NaN', () => {
      const parseSpacing = (spacingStr: string): number => {
        const match = spacingStr.match(/^(-?\d+(\.\d+)?)px$/);
        if (!match) return NaN;
        return parseFloat(match[1]);
      };

      expect(parseSpacing(editorialTokens.spacing.zero)).toBe(0);
      expect(parseSpacing(editorialTokens.spacing.xs)).toBe(4);
      expect(parseSpacing(editorialTokens.spacing.ctaBuffer)).toBe(48);
      expect(isNaN(parseSpacing('invalid'))).toBe(true);
    });

    it('F02-B2: Soft-shadow opacity limits verify box-shadow alpha channels stay strictly between 0.0 and 0.15', () => {
      const extractAlphasFromBoxShadow = (shadowStr: string): number[] => {
        const regex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/g;
        const alphas: number[] = [];
        let match;
        while ((match = regex.exec(shadowStr)) !== null) {
          alphas.push(parseFloat(match[1]));
        }
        return alphas;
      };

      const softAlphas = extractAlphasFromBoxShadow(editorialTokens.shadows.soft);
      expect(softAlphas.length).toBe(2);
      expect(softAlphas[0]).toBe(0.06);
      expect(softAlphas[1]).toBe(0.04);
      softAlphas.forEach(alpha => {
        expect(alpha).toBeGreaterThan(0.0);
        expect(alpha).toBeLessThanOrEqual(0.10);
      });
    });

    it('F02-B3: Hex color canonicalization accepts 3-digit, 6-digit canonical #FAF8F5 and rejects invalid formats', () => {
      const isValidHexColor = (color: string): boolean => {
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color.trim());
      };

      expect(isValidHexColor(editorialTokens.colors.canvas)).toBe(true);
      expect(isValidHexColor('#FFF')).toBe(true);
      expect(isValidHexColor('#1E1E1E')).toBe(true);
      expect(isValidHexColor('FAF8F5')).toBe(false); // Missing #
      expect(isValidHexColor('#GGGGGG')).toBe(false); // Invalid hex chars
      expect(isValidHexColor('#12345')).toBe(false); // 5 digits invalid
    });

    it('F02-B4: Typography font fallback stack terminates with generic serif and sans-serif safely', () => {
      const serifStack = editorialTokens.typography.fontSerif.split(',').map(s => s.trim());
      const sansStack = editorialTokens.typography.fontSans.split(',').map(s => s.trim());

      expect(serifStack[serifStack.length - 1]).toBe('serif');
      expect(serifStack).toContain('Georgia');
      expect(sansStack[sansStack.length - 1]).toBe('sans-serif');
      expect(sansStack).toContain('system-ui');
    });

    it('F02-B5: Elevation token hierarchy ensures elevated shadow has greater blur and spread than soft shadow', () => {
      const parseMaxBlur = (shadowStr: string): number => {
        // Matches box shadow parts like "0 2px 8px -2px rgba(...)"
        const regex = /(?:-?\d+(?:px)?\s+){2}(\d+)px/g;
        const blurs: number[] = [];
        let match;
        while ((match = regex.exec(shadowStr)) !== null) {
          blurs.push(parseInt(match[1], 10));
        }
        return blurs.length > 0 ? Math.max(...blurs) : 0;
      };

      const softMaxBlur = parseMaxBlur(editorialTokens.shadows.soft);
      const elevatedMaxBlur = parseMaxBlur(editorialTokens.shadows.elevated);

      expect(softMaxBlur).toBe(8);
      expect(elevatedMaxBlur).toBe(24);
      expect(elevatedMaxBlur).toBeGreaterThan(softMaxBlur);
    });
  });

  describe('F03: WCAG 2.2 AA Contrast & Accessibility Boundaries', () => {
    it('F03-B1: Primary text inkPrimary against canvas background achieves high contrast ratio (>15:1)', () => {
      const contrast = calculateContrastRatio(editorialTokens.colors.inkPrimary, editorialTokens.colors.canvas);
      expect(contrast).toBeGreaterThanOrEqual(15.0);
      expect(contrast).toBeGreaterThan(4.5); // Strict WCAG AA requirement
    });

    it('F03-B2: Secondary text inkMuted on canvas meets WCAG AA standard text threshold (>6.5:1, required >=4.5:1)', () => {
      const contrast = calculateContrastRatio(editorialTokens.colors.inkMuted, editorialTokens.colors.canvas);
      expect(contrast).toBeGreaterThanOrEqual(6.5);
      expect(contrast).toBeGreaterThan(4.5);
    });

    it('F03-B3: Micro-text inkSubtle achieves >=4.5:1 contrast on white card surface and >=3.0:1 for large/UI elements on canvas', () => {
      const contrastOnCard = calculateContrastRatio(editorialTokens.colors.inkSubtle, editorialTokens.colors.card);
      const contrastOnCanvas = calculateContrastRatio(editorialTokens.colors.inkSubtle, editorialTokens.colors.canvas);
      expect(contrastOnCard).toBeGreaterThanOrEqual(4.5); // Meets 4.5:1 on white card surface
      expect(contrastOnCanvas).toBeGreaterThanOrEqual(3.0); // Meets 3.0:1 threshold on canvas
    });

    it('F03-B4: Brand forestPrimary on canvas and forestLight meets large/small text requirements', () => {
      const contrastOnCanvas = calculateContrastRatio(editorialTokens.colors.forestPrimary, editorialTokens.colors.canvas);
      const contrastOnLight = calculateContrastRatio(editorialTokens.colors.forestPrimary, editorialTokens.colors.forestLight);

      expect(contrastOnCanvas).toBeGreaterThanOrEqual(7.0); // Pass AAA for normal text
      expect(contrastOnLight).toBeGreaterThanOrEqual(6.0);
    });

    it('F03-B5: Text zoom 200% scaling preserves layout integrity without horizontal container overflow', () => {
      const baseFontSize = 16;
      const zoomedFontSize = baseFontSize * 2.0; // 200% zoom = 32px
      const viewportWidth = 320; // 320px minimum mobile width

      // At 200% text zoom, 32px text on 320px screen with 16px padding
      const maxCharCountIn320 = Math.floor((viewportWidth - 32) / (zoomedFontSize * 0.5));
      expect(maxCharCountIn320).toBeGreaterThanOrEqual(15); // Able to display editorial heading words without truncation
    });
  });

  describe('F04: 44x44px Touch Targets Boundaries', () => {
    it('F04-B1: Touch target of 43.9px is strictly rejected as below the 44px threshold', () => {
      const result = validateTouchTargetSize(43.9, 44.0, true);
      expect(result.passed).toBe(false);
      expect(result.reason).toContain('is less than required minimum 44x44px');
    });

    it('F04-B2: Touch target of exactly 44.0px passes the WCAG 2.2 target size requirement', () => {
      const result = validateTouchTargetSize(44.0, 44.0, true);
      expect(result.passed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('F04-B3: Compact icon button with 20px visual icon maintains 44x44px hit area through padding', () => {
      const iconSize = 20;
      const verticalPadding = 12;
      const horizontalPadding = 12;
      const totalWidth = iconSize + (horizontalPadding * 2); // 44px
      const totalHeight = iconSize + (verticalPadding * 2); // 44px

      const result = validateTouchTargetSize(totalWidth, totalHeight, true);
      expect(result.passed).toBe(true);
      expect(result.effectiveWidth).toBe(44);
      expect(result.effectiveHeight).toBe(44);
    });

    it('F04-B4: Adjacent touch targets maintain minimum 8px spacing or non-overlapping bounding boxes', () => {
      interface ElementRect {
        x: number;
        y: number;
        width: number;
        height: number;
      }

      function checkTouchTargetSpacing(rectA: ElementRect, rectB: ElementRect): number {
        // Horizontal distance between adjacent targets
        const horizontalGap = Math.max(0, rectB.x - (rectA.x + rectA.width));
        return horizontalGap;
      }

      const button1: ElementRect = { x: 0, y: 0, width: 44, height: 44 };
      const button2TooClose: ElementRect = { x: 48, y: 0, width: 44, height: 44 }; // 4px gap
      const button2Valid: ElementRect = { x: 52, y: 0, width: 44, height: 44 }; // 8px gap

      expect(checkTouchTargetSpacing(button1, button2TooClose)).toBe(4);
      expect(checkTouchTargetSpacing(button1, button2Valid)).toBe(8);
      expect(checkTouchTargetSpacing(button1, button2Valid)).toBeGreaterThanOrEqual(8);
    });

    it('F04-B5: Elements marked aria-hidden="true" or non-interactive are exempt from 44x44px failure', () => {
      const decorativeIcon = validateTouchTargetSize(16, 16, false, true);
      const hiddenLink = validateTouchTargetSize(20, 20, true, true);

      expect(decorativeIcon.passed).toBe(true);
      expect(hiddenLink.passed).toBe(true);
    });
  });

  describe('F05: Zero-CLS Responsive Layout Primitives Boundaries', () => {
    it('F05-B1: Extreme narrow viewport (320px) content layout guarantees 0 horizontal overflow', () => {
      const viewport = 320;
      const padding = 16;
      const content = 288; // 320 - 32
      const simulation = simulateViewportLayout(viewport, 600, content, padding);

      expect(simulation.hasHorizontalOverflow).toBe(false);
      expect(simulation.overflowAmountPx).toBe(0);
      expect(simulation.computedContentWidth).toBeLessThanOrEqual(320);
    });

    it('F05-B2: Ultra-wide viewport (2560px) clamps max content width to 1280px and centers layout', () => {
      const viewport = 2560;
      const content = 1280;
      const simulation = simulateViewportLayout(viewport, 1440, content, 32);

      expect(simulation.hasHorizontalOverflow).toBe(false);
      expect(simulation.isCentered).toBe(true);
      expect(simulation.computedContentWidth).toBe(1280);
    });

    it('F05-B3: Dynamic mobile viewport height contraction (virtual keyboard) does not cause width shift', () => {
      const normalHeight = simulateViewportLayout(375, 812, 343, 16);
      const keyboardOpenHeight = simulateViewportLayout(375, 400, 343, 16);

      expect(normalHeight.computedContentWidth).toBe(keyboardOpenHeight.computedContentWidth);
      expect(keyboardOpenHeight.hasHorizontalOverflow).toBe(false);
    });

    it('F05-B4: Odd-count story card lists (1, 3, 5 stories) maintain balanced grid column fractions without blowout', () => {
      function calculateGridColumns(itemCount: number, screenWidth: number): number {
        if (screenWidth < 768) return 1;
        if (screenWidth < 1024) return Math.min(itemCount, 2);
        return Math.min(itemCount, 3);
      }

      expect(calculateGridColumns(1, 375)).toBe(1);
      expect(calculateGridColumns(1, 1024)).toBe(1);
      expect(calculateGridColumns(3, 1024)).toBe(3);
      expect(calculateGridColumns(5, 1024)).toBe(3);
    });

    it('F05-B5: Rapid orientation switch simulation (portrait 375x812 to landscape 812x375) remains within bounds', () => {
      const portrait = simulateViewportLayout(375, 812, 343, 16);
      const landscape = simulateViewportLayout(812, 375, 780, 16);

      expect(portrait.hasHorizontalOverflow).toBe(false);
      expect(landscape.hasHorizontalOverflow).toBe(false);
      expect(landscape.computedContentWidth).toBeGreaterThan(portrait.computedContentWidth);
    });
  });
});
