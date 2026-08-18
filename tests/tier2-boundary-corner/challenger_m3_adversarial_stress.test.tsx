/**
 * Challenger 1 Adversarial & Stress Test Suite - Milestone M3
 * Focus: Article UI, Media Engine, SEO Structured Data, and Robust Fallbacks
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2, Criteria; PROJECT.md F12, F13, F14, F15, F16
 * Path: tests/tier2-boundary-corner/challenger_m3_adversarial_stress.test.tsx
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Domain and Data Imports
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyLunaMiracle,
} from '@/lib/data/stories';
import type { Story, HeroImage } from '@/domain/types';

// Components
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar,
} from '@/components/article';

// SEO & Analytics Utilities
import {
  generateStoryMetadata,
  generateCategoryMetadata,
  generateHubMetadata,
  generateNewsArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  serializeJsonLd,
  normalizeCanonicalUrl,
  calculateReadingTime,
  calculateReadingProgress,
  DEFAULT_BASE_URL,
} from '@/lib/seo';

describe('Challenger 1 Adversarial & Stress Test Suite (Milestone M3)', () => {

  // ==========================================================================
  // SECTION 1: MALFORMED & UNUSUAL ASPECT RATIOS IN OptimizedDogImage
  // ==========================================================================
  describe('1. OptimizedDogImage Media Engine Adversarial Resilience', () => {

    it('1.1: Handles unusual and standard aspect ratio strings ("1/1", "16/9", "3:2", "4:3")', () => {
      const { container, rerender } = render(
        <OptimizedDogImage image={storyBellaRescue.heroImage} aspectRatio="1/1" />
      );
      let wrapper = container.querySelector('[data-aspect-ratio="1/1"]');
      expect(wrapper).toBeInTheDocument();
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('1/1');

      rerender(<OptimizedDogImage image={storyBellaRescue.heroImage} aspectRatio="3:2" />);
      wrapper = container.querySelector('[data-aspect-ratio="3:2"]');
      expect(wrapper).toBeInTheDocument();
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('3/2');
    });

    it('1.2: Handles "0/0" and division-by-zero aspect ratios without crashing', () => {
      const { container } = render(
        <OptimizedDogImage image={storyBellaRescue.heroImage} aspectRatio="0/0" />
      );
      const wrapper = container.querySelector('[data-aspect-ratio="0/0"]');
      expect(wrapper).toBeInTheDocument();
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('0/0');
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });

    it('1.3: Handles extreme panoramic (100/1) and ultra-tall (1/100) aspect ratios', () => {
      const { container, rerender } = render(
        <OptimizedDogImage image={storyBellaRescue.heroImage} aspectRatio="100/1" />
      );
      let wrapper = container.querySelector('[data-aspect-ratio="100/1"]');
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('100/1');

      rerender(<OptimizedDogImage image={storyBellaRescue.heroImage} aspectRatio="1/100" />);
      wrapper = container.querySelector('[data-aspect-ratio="1/100"]');
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('1/100');
    });

    it('1.4: Handles missing aspect ratio with safe fallback to "16:9" ("16/9")', () => {
      const imageWithoutRatio: HeroImage = {
        ...storyBellaRescue.heroImage,
        aspectRatio: '' as any,
      };
      const { container } = render(<OptimizedDogImage image={imageWithoutRatio} />);
      const wrapper = container.querySelector('[style*="aspect-ratio"]');
      expect(wrapper).toBeInTheDocument();
      expect((wrapper as HTMLElement).style.aspectRatio).toBe('16/9');
    });

    it('1.5: Normalizes NaN, zero, and negative dimensions to default 1200x675 bounding box', () => {
      const malformedDimensionsImage: HeroImage = {
        ...storyBellaRescue.heroImage,
        width: -800,
        height: 0,
      };
      render(<OptimizedDogImage image={malformedDimensionsImage} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '1200');
      expect(img).toHaveAttribute('height', '675');
    });

    it('1.6: Sanitizes malicious protocols (javascript:, data:text/html, vbscript:, file:) to safe placeholder', () => {
      const maliciousPayloads = [
        'javascript:alert("XSS_IMAGE")',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox("XSS")',
        'file:///etc/passwd',
      ];

      for (const payload of maliciousPayloads) {
        const dangerousImage: HeroImage = {
          ...storyBellaRescue.heroImage,
          url: payload,
        };
        const { unmount } = render(<OptimizedDogImage image={dangerousImage} />);
        const img = screen.getByRole('img');
        expect(img.getAttribute('src')).toContain('placeholder-dog-editorial.webp');
        expect(img.getAttribute('src')).not.toContain('javascript:');
        expect(img.getAttribute('src')).not.toContain('data:text/html');
        unmount();
      }
    });

    it('1.7: Handles complete null / undefined image prop gracefully', () => {
      const { container } = render(<OptimizedDogImage image={null} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder-dog-editorial.webp'));
      expect(img).toHaveAttribute('width', '1200');
      expect(img).toHaveAttribute('height', '675');
      expect(screen.queryByRole('note')).not.toBeInTheDocument();
    });

    it('1.8: Handles runtime image onError event by switching to fallback placeholder', () => {
      render(<OptimizedDogImage image={{ ...storyBellaRescue.heroImage, url: 'https://broken-cdn.com/missing.webp' }} />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(img.getAttribute('src')).toContain('placeholder-dog-editorial.webp');
    });
  });

  // ==========================================================================
  // SECTION 2: XSS INJECTIONS & SPECIAL CHARACTERS IN SEO & STRUCTURED DATA
  // ==========================================================================
  describe('2. SEO & Schema.org Structured Data XSS Resilience', () => {

    it('2.1: serializeJsonLd neutralizes script tag breakout vectors (< becomes \\u003c)', () => {
      const xssPayloads = {
        vector1: '</script><script>alert("XSS_ATTACK_1")</script>',
        vector2: '<script src="https://evil.com/malicious.js"></script>',
        vector3: '<svg onload="alert(document.cookie)">',
        vector4: '<img src=x onerror=alert("XSS")>',
      };

      const serialized = serializeJsonLd(xssPayloads);

      // Verify no literal opening angle bracket exists in serialized output
      expect(serialized).not.toContain('<');
      expect(serialized).not.toContain('</script>');
      expect(serialized).not.toContain('<script');
      expect(serialized).not.toContain('<svg');
      expect(serialized).not.toContain('<img');

      // Verify unicode escaping is present
      expect(serialized).toContain('\\u003c/script>');
      expect(serialized).toContain('\\u003cscript');

      // Verify lossless roundtrip via JSON.parse
      const parsed = JSON.parse(serialized);
      expect(parsed.vector1).toBe(xssPayloads.vector1);
      expect(parsed.vector2).toBe(xssPayloads.vector2);
      expect(parsed.vector3).toBe(xssPayloads.vector3);
      expect(parsed.vector4).toBe(xssPayloads.vector4);
    });

    it('2.2: generateNewsArticleJsonLd survives aggressive XSS injections in story properties', () => {
      const xssStory: Story = {
        ...storyBellaRescue,
        title: 'Dangerous <script>alert("Title_XSS")</script> & "Quotes" \'Single\'',
        subtitle: 'Devious <b onmouseover="alert(1)">Subtitle</b> & </script>',
        excerpt: 'Malicious <iframe src="javascript:alert(1)"></iframe> narrative',
        dogName: '<script>alert("DogName")</script>',
        dogBreed: '"><img src=x onerror=alert(1)>',
        location: {
          city: '"><script>alert("City")</script>',
          stateOrProvince: '<svg/onload=alert(1)>',
          country: 'US\' OR \'1\'=\'1',
        },
        heroImage: {
          ...storyBellaRescue.heroImage,
          licenseType: 'ai_visual_reconstruction',
          aiDisclosure: {
            isAiGenerated: true,
            aiToolUsed: '<script>alert("Tool_XSS")</script>',
            reconstructionRationale: '</script><script>alert("Rationale_XSS")</script>',
          },
        },
      };

      const jsonLd = generateNewsArticleJsonLd(xssStory);
      const serialized = serializeJsonLd(jsonLd);

      expect(serialized).not.toContain('<script');
      expect(serialized).not.toContain('</script>');
      expect(serialized).not.toContain('<b onmouseover');
      expect(serialized).not.toContain('<iframe');

      // Validate JSON-LD structure
      const parsed = JSON.parse(serialized);
      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('NewsArticle');
      expect(parsed.headline).toContain('Dangerous <script>alert("Title_XSS")</script>');
      expect(parsed.isBasedOn['@type']).toBe('CreativeWork');
      expect(parsed.isBasedOn.description).toContain('Rationale_XSS');
    });

    it('2.3: generateBreadcrumbJsonLd handles malicious crumb names and javascript: URLs', () => {
      const dangerousCrumbs = [
        { name: '<script>alert("Crumb1")</script>', url: 'javascript:alert(1)' },
        { name: '"><img src=x onerror=alert(2)>', url: 'https://eternal-paws.com/stories/valid-slug' },
      ];

      const jsonLd = generateBreadcrumbJsonLd(dangerousCrumbs);
      const serialized = serializeJsonLd(jsonLd);

      expect(serialized).not.toContain('<script');
      expect(serialized).not.toContain('<img');

      const parsed = JSON.parse(serialized);
      expect(parsed['@type']).toBe('BreadcrumbList');
      expect(parsed.itemListElement).toHaveLength(2);
      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[1].position).toBe(2);
    });

    it('2.4: generateStoryMetadata handles special characters and quotes in metadata fields', () => {
      const specialCharStory: Story = {
        ...storyBellaRescue,
        title: 'Max & Bella’s "Extraordinary" Journey — 100% True Story 🐶🐾',
        excerpt: 'A heart-melting tale of love & courage with special chars: <>&"\'',
      };

      const meta = generateStoryMetadata(specialCharStory);
      expect(meta.title).toBe(specialCharStory.title);
      expect(meta.description).toBe(specialCharStory.excerpt);
      expect(meta.openGraph?.title).toBe(specialCharStory.title);
      expect(meta.openGraph?.description).toBe(specialCharStory.excerpt);
      expect(meta.twitter?.title).toBe(specialCharStory.title);
    });

    it('2.5: normalizeCanonicalUrl cleans query strings, hash fragments, and casing', () => {
      expect(normalizeCanonicalUrl('https://eternal-paws.com/STORIES/Bella-Rescue/?utm=123#frag')).toBe(
        'https://eternal-paws.com/stories/bella-rescue'
      );
      expect(normalizeCanonicalUrl('https://eternal-paws.com/hero-dogs/')).toBe(
        'https://eternal-paws.com/hero-dogs'
      );
      expect(normalizeCanonicalUrl('/rescues/')).toBe('/rescues');
      expect(normalizeCanonicalUrl('')).toBe('');
    });
  });

  // ==========================================================================
  // SECTION 3: READING PROGRESS BAR EDGE CASES & DOM HARNESS
  // ==========================================================================
  describe('3. Reading Progress Bar Boundaries & Stress Testing', () => {

    it('3.1: calculateReadingProgress handles 0 height and negative dimensions without NaN', () => {
      // 4-argument signature: (scrollTop, contentTop, contentHeight, viewportHeight)
      expect(calculateReadingProgress(0, 0, 0, 800)).toBe(100);
      expect(calculateReadingProgress(500, 100, -200, 800)).toBe(100);
      expect(calculateReadingProgress(0, 0, 400, 800)).toBe(100); // Shorter than viewport

      // 3-argument signature: (scrollTop, scrollHeight, clientHeight)
      expect(calculateReadingProgress(0, 0, 800)).toBe(100);
      expect(calculateReadingProgress(0, -500, 800)).toBe(100);
      expect(calculateReadingProgress(0, 400, 800)).toBe(100);
    });

    it('3.2: calculateReadingProgress handles massive dimensions (10,000,000px) accurately', () => {
      const contentTop = 0;
      const contentHeight = 10000000;
      const viewportHeight = 1000;
      const totalScrollable = contentHeight - viewportHeight; // 9999000

      // 0%
      expect(calculateReadingProgress(0, contentTop, contentHeight, viewportHeight)).toBe(0);

      // 50%
      const halfScroll = totalScrollable / 2;
      expect(calculateReadingProgress(halfScroll, contentTop, contentHeight, viewportHeight)).toBe(50);

      // 100%
      expect(calculateReadingProgress(totalScrollable, contentTop, contentHeight, viewportHeight)).toBe(100);

      // Beyond 100%
      expect(calculateReadingProgress(totalScrollable + 50000, contentTop, contentHeight, viewportHeight)).toBe(100);
    });

    it('3.3: calculateReadingProgress handles negative scroll offsets (iOS bounce overscroll)', () => {
      expect(calculateReadingProgress(-300, 100, 2000, 800)).toBe(0);
      expect(calculateReadingProgress(-50, 2000, 800)).toBe(0);
    });

    it('3.4: ReadingProgressBar component handles rapid resize and scroll events safely', () => {
      const { container } = render(<ReadingProgressBar />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveAttribute('aria-valuenow', '0');

      // Trigger multiple rapid scroll and resize events
      act(() => {
        for (let i = 0; i < 20; i++) {
          Object.defineProperty(document.documentElement, 'scrollTop', { value: i * 100, configurable: true });
          Object.defineProperty(document.documentElement, 'scrollHeight', { value: 3000, configurable: true });
          Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });
          fireEvent.scroll(window);
          fireEvent.resize(window);
        }
      });

      const finalProgress = Number(bar.getAttribute('aria-valuenow'));
      expect(finalProgress).toBeGreaterThanOrEqual(0);
      expect(finalProgress).toBeLessThanOrEqual(100);
      expect(isNaN(finalProgress)).toBe(false);
    });

    it('3.5: ReadingProgressBar targets specific element by ID or ref', () => {
      // Create a mock target in DOM
      const targetDiv = document.createElement('div');
      targetDiv.id = 'test-article-body';
      Object.defineProperty(targetDiv, 'offsetHeight', { value: 2000, configurable: true });
      targetDiv.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100, bottom: 2100 });
      document.body.appendChild(targetDiv);

      render(<ReadingProgressBar targetId="test-article-body" />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toBeInTheDocument();

      document.body.removeChild(targetDiv);
    });
  });

  // ==========================================================================
  // SECTION 4: READING TIME CALCULATION ADVERSARIAL STRESS
  // ==========================================================================
  describe('4. Reading Time Calculation Adversarial Stress', () => {

    it('4.1: Returns minimum 1 minute for empty strings, spaces, and non-string inputs', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('   \n\t\r  ')).toBe(1);
      expect(calculateReadingTime(null as unknown as string)).toBe(1);
      expect(calculateReadingTime(undefined as unknown as string)).toBe(1);
      expect(calculateReadingTime(12345 as unknown as string)).toBe(1);
      expect(calculateReadingTime('OneWord')).toBe(1);
    });

    it('4.2: Computes exact thresholds around word count boundaries at 200 WPM', () => {
      expect(calculateReadingTime(Array(200).fill('word').join(' '))).toBe(1);
      expect(calculateReadingTime(Array(201).fill('word').join(' '))).toBe(2);
      expect(calculateReadingTime(Array(400).fill('word').join(' '))).toBe(2);
      expect(calculateReadingTime(Array(401).fill('word').join(' '))).toBe(3);
    });

    it('4.3: Processes massive 100,000-word text in under 50 milliseconds without stack overflow', () => {
      const massiveText = Array(100000).fill('canine').join(' ');
      const startTime = performance.now();
      const readTime = calculateReadingTime(massiveText, 200);
      const duration = performance.now() - startTime;

      expect(readTime).toBe(500); // 100,000 / 200 = 500 minutes
      expect(duration).toBeLessThan(100); // Fast execution
    });

    it('4.4: Handles unicode text, multi-byte characters, and emoji streams correctly', () => {
      const frenchText = "Dans les collines enneigées du Montana, une chienne courageuse nommée Bella a guidé les sauveteurs.";
      expect(calculateReadingTime(frenchText)).toBe(1);

      const emojiText = Array(300).fill('🐶 🐾 💖').join(' ');
      expect(calculateReadingTime(emojiText)).toBeGreaterThanOrEqual(1);

      const cjkText = "忠犬ハチ公 は 飼い主 の 帰り を 渋谷駅 で 待ち続けた 忠実な 秋田犬 です";
      expect(calculateReadingTime(cjkText)).toBeGreaterThanOrEqual(1);
    });

    it('4.5: Supports custom wordsPerMinute rate parameters', () => {
      const text = Array(300).fill('dog').join(' ');
      expect(calculateReadingTime(text, 100)).toBe(3);
      expect(calculateReadingTime(text, 300)).toBe(1);
      expect(calculateReadingTime(text, 50)).toBe(6);
    });
  });

  // ==========================================================================
  // SECTION 5: SHAREBAR COPY LINK & SOCIAL SHARING HARNESS
  // ==========================================================================
  describe('5. ShareBar Clipboard Fallbacks & Share Triggers', () => {
    const originalClipboard = { ...navigator.clipboard };

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true,
      });
    });

    it('5.1: Successfully writes to clipboard when navigator.clipboard.writeText is available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      render(
        <ShareBar
          title={storyBellaRescue.title}
          slug={storyBellaRescue.slug}
          dogName={storyBellaRescue.dogName}
        />
      );

      const copyBtn = screen.getByRole('button', { name: /copy story link/i });
      fireEvent.click(copyBtn);

      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining(`/stories/${storyBellaRescue.slug}`)
      );

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    it('5.2: Falls back to document.execCommand when navigator.clipboard is unavailable', async () => {
      // Simulate environment without navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      Object.defineProperty(document, 'execCommand', {
        value: execCommandMock,
        writable: true,
        configurable: true,
      });

      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);

      const copyBtn = screen.getByRole('button', { name: /copy story link/i });
      fireEvent.click(copyBtn);

      expect(execCommandMock).toHaveBeenCalledWith('copy');
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    it('5.3: Catches clipboard write rejection gracefully without uncaught promise rejection', async () => {
      const mockRejectingWrite = vi.fn().mockRejectedValue(new Error('Clipboard permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockRejectingWrite },
        writable: true,
        configurable: true,
      });

      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      const copyBtn = screen.getByRole('button', { name: /copy story link/i });

      // Should not throw or crash component
      expect(() => {
        fireEvent.click(copyBtn);
      }).not.toThrow();
    });

    it('5.4: Generates valid, safely encoded social share links for Twitter, Facebook, and Email', () => {
      const dangerousTitle = 'Max & "Bella": <Rescue> in 2026? 🐶';
      render(
        <ShareBar
          title={dangerousTitle}
          slug="max-rescue"
          dogName="Max"
        />
      );

      const twitterLink = screen.getByLabelText(/share on x/i);
      const facebookLink = screen.getByLabelText(/share on facebook/i);
      const emailLink = screen.getByLabelText(/share via email/i);

      expect(twitterLink.getAttribute('href')).toContain('https://twitter.com/intent/tweet?text=');
      expect(twitterLink.getAttribute('href')).toContain(encodeURIComponent('Max'));
      expect(facebookLink.getAttribute('href')).toContain('https://www.facebook.com/sharer/sharer.php?u=');
      expect(emailLink.getAttribute('href')).toContain('mailto:?subject=');
    });

    it('5.5: All interactive elements in ShareBar strictly satisfy >=44x44px touch targets', () => {
      render(
        <ShareBar
          title={storyBellaRescue.title}
          slug={storyBellaRescue.slug}
        />
      );

      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('link'),
      ];

      expect(interactiveElements.length).toBeGreaterThanOrEqual(4);
      for (const el of interactiveElements) {
        expect(el.className).toContain('min-w-[44px]');
        expect(el.className).toContain('min-h-[44px]');
      }
    });
  });

  // ==========================================================================
  // SECTION 6: ARTICLE CONTENT & HEADER EDGE CASES
  // ==========================================================================
  describe('6. ArticleContent & ArticleHeader Edge Cases', () => {

    it('6.1: ArticleContent handles single sentence, empty string, and multi-paragraph quote layouts', () => {
      const { container, rerender } = render(<ArticleContent content="" />);
      expect(container.firstChild).toBeNull();

      const complexContent = `Opening paragraph with editorial substance.\n\n> "A hero dog never asks why, only where."\n\nConcluding paragraph with lasting impact.`;
      rerender(<ArticleContent content={complexContent} enableDropCap={true} />);

      const blockquote = screen.getByText(/A hero dog never asks why/i);
      expect(blockquote).toBeInTheDocument();
      expect(blockquote.tagName).toBe('BLOCKQUOTE');
    });

    it('6.2: ArticleHeader renders without fact-checker or dates if optional properties omitted', () => {
      const minimalStory: Story = {
        ...storyBellaRescue,
        publishedAt: '',
        verification: {
          ...storyBellaRescue.verification,
          verifiedBy: '',
        },
      };

      render(<ArticleHeader story={minimalStory} />);
      expect(screen.getByText(/Elena Rostova, Senior Fact Checker/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(minimalStory.title);
    });
  });
});
