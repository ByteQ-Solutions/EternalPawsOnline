# Technical Specification & Analysis: Zero-CLS Responsive Layout Primitives & Testing Strategy (F05, M1)

**Agent**: Explorer 3 (`explorer_m1_3`)  
**Milestone**: M1 — Soft-Shadow Design System & Mobile UX  
**Scope**: F05 (Zero-CLS Responsive Layout Primitives & Mobile UX), Unit & Component Testing Architecture  
**Target Directories**: `components/layout/`, `app/`, `tests/unit/`, `tests/components/`  
**Date**: 2026-08-18  

---

## 1. Executive Summary & Architectural Overview

Eternal Paws is an editorial media platform designed primarily for mobile-first visitors arriving from social discovery channels (Facebook/Search). To establish immediate reader trust, avoid bounce rates, and fulfill strict Web Vitals benchmarks (CLS = 0, LCP < 2.0s, INP < 150ms), the layout system must eliminate visual layout shifts, guarantee WCAG 2.2 AA accessibility, and offer ergonomic 44x44px touch targets across viewports from 320px to 1440px+.

This specification defines:
1. **Zero-CLS Layout Primitives**: Production-ready blueprints for `Header`, `MobileNav`, `Footer`, `Breadcrumbs`, `SkipToContent`, and `app/layout.tsx`.
2. **Mobile UX & Keyboard Navigation**: Accessible drawer dialogs with focus trapping, ESC key listeners, body scroll locks, and screen reader announcements.
3. **Mathematical Contrast Verification**: Automated relative luminance and contrast ratio calculations ensuring all token pairings meet or exceed 4.5:1 (AA normal text) and 3:1 (large text/UI components).
4. **Comprehensive Test Suites**: Exhaustive Vitest and `@testing-library/react` suites for `tests/unit/design-system.test.ts` and `tests/components/layout.test.tsx`, fully synchronized with the 4-tier testing hierarchy in `TEST_INFRA.md`.

---

## 2. Zero-CLS Responsive Layout Architecture (F05)

### 2.1 Layout Sizing & Containment Principles
Cumulative Layout Shift (CLS) occurs when elements render dynamically without prior dimension reservations or shift during stylesheet and font loading. The layout architecture enforces the following invariants:

| Component | Fixed/Reserved Dimensions | Technique | CLS Risk Mitigated |
|-----------|---------------------------|-----------|-------------------|
| **Header** | Mobile: `64px` (`h-16`), Desktop: `80px` (`h-20`) | Fixed height container with `sticky top-0 z-40`, backdrop blur, and explicit CSS sizing | Prevents content reflow on mount/scroll |
| **Logo** | `180px × 40px` (or `44px × 44px` icon + text container) | Explicit SVG viewBox / Next.js Image dimensions | Avoids brand image loading jump |
| **MobileNav** | Fixed overlay (`fixed inset-0 z-50`) with slide transform | CSS transforms (`translate-x-full` / `translate-x-0`) using GPU composition; portal rendering | Prevents DOM reflows and document expansion |
| **Breadcrumbs** | Min height `28px` (`min-h-[28px]`), single/multi-line flex wrap | Reserved padding and line-height container | Prevents page header jump on dynamic hydration |
| **Footer** | Predictable multi-column grid with fixed gap reservations | CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`) | Prevents bottom content jump |
| **Root Body** | `overflow-x-hidden`, `min-h-screen`, `flex flex-col` | Flexbox layout anchoring footer to bottom (`flex-1` main) | Prevents footer snapping |

### 2.2 Next.js Font Optimization & Zero-CLS Metric Matching
Typography shifts are prevented by utilizing Next.js font optimization (`next/font/google`) with automatic size-adjust metrics and `display: 'swap'`:

```typescript
// app/fonts.ts or inline in app/layout.tsx
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';

export const editorialSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-sans',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const editorialSerif = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-serif',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  fallback: ['Georgia', 'Cambria', 'serif'],
  adjustFontFallback: true,
});
```

### 2.3 Mobile Viewport Emulation & Touch Target Discipline (320px–430px)
- **Minimum Tap Target**: Every interactive anchor (`<a>`), button (`<button>`), and form control must occupy at least `44px × 44px` physical hit area. For visual elements smaller than 44px (e.g., a 20px icon or compact breadcrumb tag), a `::before` pseudo-element expansion or `min-w-[44px] min-h-[44px] flex items-center justify-center` wrapper is enforced.
- **Viewport Boundary**: 320px (iPhone SE 1st gen / narrow devices) must render with zero horizontal scroll (`overflow-x: hidden` on root, max-w constraints `max-w-full w-full`, word-break handling `break-words`).
- **Focus Rings**: WCAG 2.2 AA Success Criterion 2.4.13 (Focus Appearance) requires visible 2px focus outlines with high-contrast offsets: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas`.

---

## 3. Layout Component Technical Specifications & Blueprints

### 3.1 `components/layout/SkipToContent.tsx`
Provides immediate keyboard accessibility to bypass repetitive navigation landmarks.

```tsx
'use client';

import React from 'react';

export interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-forestPrimary focus:text-canvas focus:font-medium focus:text-sm focus:rounded-md focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 focus:ring-offset-canvas transition-transform duration-150 ${className}`}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
```

---

### 3.2 `components/layout/Header.tsx`
Responsive editorial header with brand identity, semantic category navigation, search trigger, submission CTA, and mobile hamburger drawer trigger.

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, HeartHandshake, PenTool } from 'lucide-react';
import MobileNav from './MobileNav';

export interface HeaderProps {
  className?: string;
}

export interface NavItem {
  label: string;
  href: string;
  categorySlug?: string;
}

export const CATEGORY_NAV_ITEMS: NavItem[] = [
  { label: 'Reunions', href: '/reunions', categorySlug: 'reunions' },
  { label: 'Hero Dogs', href: '/hero-dogs', categorySlug: 'hero-dogs' },
  { label: 'Rescues', href: '/rescues', categorySlug: 'rescues' },
  { label: 'Survival', href: '/survival', categorySlug: 'survival' },
  { label: 'Loyalty', href: '/loyalty', categorySlug: 'loyalty' },
  { label: 'Lost & Found', href: '/lost-and-found', categorySlug: 'lost-and-found' },
];

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        role="banner"
        className={`sticky top-0 z-40 w-full h-16 md:h-20 bg-canvas/95 backdrop-blur-md border-b transition-all duration-200 ${
          isScrolled ? 'border-borderLight shadow-soft' : 'border-borderLight/60'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="group flex items-center gap-2 min-h-[44px] min-w-[44px] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-md"
              aria-label="Eternal Paws Home"
            >
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-canvas shadow-soft group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5 text-goldLight" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-inkPrimary group-hover:text-forestPrimary transition-colors">
                Eternal Paws
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-1 xl:space-x-2"
          >
            {CATEGORY_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary ${
                    isActive
                      ? 'text-forestPrimary bg-forestLight/60 font-semibold'
                      : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Actions & Mobile Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger Button */}
            <Link
              href="/search"
              aria-label="Search stories by dog, breed, location, or theme"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-md text-inkMuted hover:text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Submit Story CTA (Desktop) */}
            <Link
              href="/submit-story"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs md:text-sm font-semibold text-canvas bg-forestPrimary hover:bg-forestPrimary/90 rounded-md shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <PenTool className="w-4 h-4 text-goldLight" aria-hidden="true" />
              <span>Submit Story</span>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open main navigation menu"
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-md text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={CATEGORY_NAV_ITEMS}
        currentPath={pathname}
      />
    </>
  );
};

export default Header;
```

---

### 3.3 `components/layout/MobileNav.tsx`
Accessible slide-out mobile drawer dialog implementing full WAI-ARIA Dialog (Modal) pattern, focus trapping, ESC listener, and minimum 44px touch targets.

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search, HeartHandshake, ShieldCheck, FileText, HelpCircle, AlertCircle, PenTool } from 'lucide-react';
import { NavItem } from './Header';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentPath?: string;
}

export const TRUST_NAV_ITEMS = [
  { label: 'Fact-Checking Policy', href: '/fact-checking', icon: ShieldCheck },
  { label: 'Editorial Policy', href: '/editorial-policy', icon: FileText },
  { label: 'Corrections Center', href: '/corrections', icon: AlertCircle },
  { label: 'About Eternal Paws', href: '/about', icon: HelpCircle },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navItems,
  currentPath = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & keyboard management
  useEffect(() => {
    if (!isOpen) return;

    // Save active element to restore upon close
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on mount
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-nav-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-inkPrimary/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative ml-auto w-full max-w-sm sm:max-w-md bg-canvas h-full shadow-elevated border-l border-borderLight flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-300 ease-out"
      >
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-borderLight bg-canvas">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-canvas">
                <HeartHandshake className="w-5 h-5 text-goldLight" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-bold text-inkPrimary">
                Eternal Paws
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-md text-inkMuted hover:text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Quick Search Action */}
          <div className="p-4 border-b border-borderLight/60">
            <Link
              href="/search"
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] px-4 py-2.5 bg-card border border-borderLight rounded-md text-inkMuted hover:text-inkPrimary hover:border-inkMuted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary text-sm"
            >
              <Search className="w-4 h-4 text-inkSubtle" aria-hidden="true" />
              <span>Search verified dog stories...</span>
            </Link>
          </div>

          {/* Primary Editorial Categories */}
          <div className="px-4 py-3">
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-inkSubtle">
              Story Categories
            </p>
            <nav className="mt-1 space-y-1" aria-label="Mobile Story Categories">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary ${
                      isActive
                        ? 'text-forestPrimary bg-forestLight/80 font-semibold'
                        : 'text-inkPrimary hover:bg-cardMuted'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-inkSubtle font-normal">Explore &rarr;</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Trust & Editorial Integrity Section */}
          <div className="px-4 py-3 border-t border-borderLight/60">
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-inkSubtle">
              Trust & Editorial
            </p>
            <div className="mt-1 space-y-1">
              {TRUST_NAV_ITEMS.map((trustItem) => {
                const IconComponent = trustItem.icon;
                const isActive = currentPath === trustItem.href;
                return (
                  <Link
                    key={trustItem.href}
                    href={trustItem.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 min-h-[44px] px-3.5 py-2.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary ${
                      isActive
                        ? 'text-forestPrimary bg-forestLight/80 font-semibold'
                        : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
                    <span>{trustItem.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-borderLight bg-cardMuted/50 space-y-3">
          <Link
            href="/submit-story"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-3 text-sm font-semibold text-canvas bg-forestPrimary hover:bg-forestPrimary/90 rounded-md shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
          >
            <PenTool className="w-4 h-4 text-goldLight" aria-hidden="true" />
            <span>Submit a True Dog Story</span>
          </Link>
          <p className="text-center text-xs text-inkSubtle">
            All submitted stories undergo 4-tier fact verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
```

---

### 3.4 `components/layout/Footer.tsx`
Editorial footer featuring newsletter signup teaser, categorized directory links, trust/policy links, copyright, and mandatory AI disclosure notice.

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { CATEGORY_NAV_ITEMS } from './Header';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      role="contentinfo"
      className={`bg-canvas border-t border-borderLight pt-14 pb-10 text-inkPrimary ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Teaser Box */}
        <div className="bg-card border border-borderLight rounded-xl p-6 sm:p-8 md:p-10 shadow-soft mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold uppercase tracking-wider mb-3">
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Weekly Newsletter</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary tracking-tight">
              Join the Pack — One True Dog Story Every Sunday
            </h2>
            <p className="mt-2 text-inkMuted text-sm sm:text-base leading-relaxed">
              No spam, no clickbait. Just one rigorously verified, heart-stirring dog story delivered to your inbox every Sunday morning.
            </p>
          </div>
          <div className="w-full lg:w-auto flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handled by newsletter handler or router push
                window.location.href = '/#newsletter-signup';
              }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                className="min-h-[44px] px-4 py-2.5 rounded-md border border-borderLight bg-canvas text-inkPrimary placeholder:text-inkSubtle text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary w-full sm:w-72"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 bg-forestPrimary hover:bg-forestPrimary/90 text-canvas font-semibold text-sm rounded-md shadow-soft transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <span>Subscribe Free</span>
                <ArrowRight className="w-4 h-4 text-goldLight" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Multi-Column Editorial Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-borderLight">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-canvas">
                <HeartHandshake className="w-5 h-5 text-goldLight" aria-hidden="true" />
              </span>
              <span className="font-serif text-xl font-bold text-inkPrimary">
                Eternal Paws
              </span>
            </div>
            <p className="text-inkMuted text-sm leading-relaxed">
              Honoring the extraordinary bond between dogs and humans through verified, uplifting, and rigorously fact-checked digital journalism.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-forestPrimary">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>4-Tier Verification Standards</span>
            </div>
          </div>

          {/* Col 2: Story Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-inkSubtle mb-4">
              Story Categories
            </h3>
            <ul className="space-y-2.5" role="list">
              {CATEGORY_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Trust & Integrity */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-inkSubtle mb-4">
              Trust & Standards
            </h3>
            <ul className="space-y-2.5" role="list">
              <li>
                <Link
                  href="/fact-checking"
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Fact-Checking Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Editorial Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/corrections"
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Corrections & Retractions Log
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  About Our Newsroom
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-story"
                  className="text-sm text-forestPrimary font-semibold hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Submit a Story for Review &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: AI Disclosure & Ethics Notice */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-inkSubtle mb-4">
              AI Transparency & Ethics
            </h3>
            <p className="text-xs text-inkMuted leading-relaxed">
              Every story published on Eternal Paws is verified against authentic records (shelters, police, news, veterinary clinics).
            </p>
            <div className="p-3 bg-cardMuted rounded-md border border-borderLight text-xs text-inkMuted leading-relaxed">
              <strong className="text-inkPrimary block mb-1">AI Disclosure Notice:</strong>
              Photographs are authentic records from sources. Any visual reconstructions are explicitly labeled with AI disclosure tags. We never use generative AI to fabricate stories or events.
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-inkSubtle">
          <p>
            &copy; {new Date().getFullYear()} Eternal Paws Media. Dedicated to truth, compassion, and canine devotion.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/editorial-policy#privacy"
              className="hover:text-inkPrimary min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/editorial-policy#terms"
              className="hover:text-inkPrimary min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              Terms of Service
            </Link>
            <Link
              href="/corrections"
              className="hover:text-inkPrimary min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              Submit a Correction
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

### 3.5 `components/layout/Breadcrumbs.tsx`
Semantic breadcrumbs with full Schema.org `BreadcrumbList` JSON-LD structured data and WCAG 2.2 AA compliant breadcrumb navigation trail.

```tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHomeIcon = true,
}) => {
  // Prepend Home if not explicitly present
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items.filter((i) => i.href !== '/'),
  ];

  // Generate Schema.org JSON-LD BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith('http') ? item.href : `https://eternal-paws.com${item.href}` } : {}),
    })),
  };

  return (
    <div className={`min-h-[28px] py-2 ${className}`}>
      {/* Schema.org Script Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual Accessible Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center">
        <ol className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-inkMuted">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1 || item.isCurrent;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 mx-1.5 text-inkSubtle flex-shrink-0 select-none"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-inkPrimary truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="hover:text-forestPrimary hover:underline transition-colors flex items-center gap-1 min-h-[36px] sm:min-h-[44px] px-1 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                  >
                    {index === 0 && showHomeIcon && (
                      <Home className="w-3.5 h-3.5 text-inkSubtle" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
```

---

### 3.6 `app/layout.tsx`
Root Next.js App Router layout integrating font variables, SkipToContent, Header, Footer, and strict zero-CLS layout containment.

```tsx
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import SkipToContent from '@/components/layout/SkipToContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-sans',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

const serifFont = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-serif',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  fallback: ['Georgia', 'Cambria', 'serif'],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  title: {
    default: 'Eternal Paws — Verified True Dog Stories',
    template: '%s | Eternal Paws',
  },
  description:
    'Rigorously verified, uplifting true stories of heroic dogs, joyful reunions, loyalty, and rescue miracles. Built on trust and 4-tier fact-checking.',
  metadataBase: new URL('https://eternal-paws.com'),
  keywords: ['true dog stories', 'dog reunions', 'hero dogs', 'dog rescue', 'verified pet stories'],
  authors: [{ name: 'Eternal Paws Editorial Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eternal-paws.com',
    siteName: 'Eternal Paws',
    title: 'Eternal Paws — Verified True Dog Stories',
    description: 'Verified true stories of loyalty, courage, and rescue miracles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eternal Paws — Verified True Dog Stories',
    description: 'Verified true stories of loyalty, courage, and rescue miracles.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}
    >
      <body className="bg-canvas text-inkPrimary font-sans antialiased min-h-screen flex flex-col selection:bg-forestLight selection:text-forestPrimary overflow-x-hidden">
        {/* WCAG 2.4.1 Skip Navigation Link */}
        <SkipToContent targetId="main-content" />

        {/* Global Sticky Editorial Header */}
        <Header />

        {/* Main Content Landmark */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        {/* Global Editorial Footer */}
        <Footer />
      </body>
    </html>
  );
}
```

---

## 4. Comprehensive Testing Strategy

### 4.1 Mathematical WCAG 2.2 AA Contrast Algorithm
To test color token contrast without third-party flakiness, we use the standard W3C WCAG 2.1/2.2 relative luminance formula:

1. Convert sRGB 8-bit channels ($C_{srgb} \in [0, 255]$) to normalized linear values ($R, G, B \in [0.0, 1.0]$):
   $$C_{linear} = \begin{cases} \frac{C}{255 \times 12.92} & \text{if } \frac{C}{255} \le 0.04045 \\ \left(\frac{C/255 + 0.055}{1.055}\right)^{2.4} & \text{if } \frac{C}{255} > 0.04045 \end{cases}$$

2. Compute relative luminance $L$:
   $$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$

3. Compute contrast ratio between lighter ($L_1$) and darker ($L_2$) colors:
   $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

4. Verification Criteria:
   - Normal text: $\ge 4.5:1$ (WCAG AA)
   - Large text ($\ge 18\text{pt}$ / $\ge 24\text{px}$ or $\ge 14\text{pt}$ bold): $\ge 3.0:1$
   - UI Components & Graphical Objects: $\ge 3.0:1$

---

### 4.2 Unit Test Suite Blueprint: `tests/unit/design-system.test.ts`
Tests token definitions, hex validity, typography keys, and runs mathematical contrast assertions on all foreground/background pairings.

```typescript
import { describe, it, expect } from 'vitest';
import { editorialTokens } from '@/src/design-system/tokens';

// --- Mathematical WCAG Contrast Utility ---
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function channelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function calculateRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lum1 = calculateRelativeLuminance(foregroundHex);
  const lum2 = calculateRelativeLuminance(backgroundHex);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Design System Tokens Integrity (F02, F03, F04)', () => {
  it('should define all required Soft-Shadow editorial color tokens', () => {
    const { colors } = editorialTokens;
    expect(colors.canvas).toBe('#FAF8F5');
    expect(colors.card).toBe('#FFFFFF');
    expect(colors.cardMuted).toBe('#F4F0EA');
    expect(colors.inkPrimary).toBe('#1E1E1E');
    expect(colors.inkMuted).toBe('#555555');
    expect(colors.inkSubtle).toBe('#767676');
    expect(colors.forestPrimary).toBe('#234E35');
    expect(colors.forestLight).toBe('#EBF3ED');
    expect(colors.goldAccent).toBe('#C97A1E');
    expect(colors.goldLight).toBe('#FEF7EC');
    expect(colors.borderLight).toBe('#E8E3DA');
  });

  it('should define editorial serif and sans typography variables', () => {
    const { typography } = editorialTokens;
    expect(typography.fontSerif).toContain('var(--font-editorial-serif)');
    expect(typography.fontSans).toContain('var(--font-editorial-sans)');
  });

  it('should enforce 44px minimum touch target definition', () => {
    expect(editorialTokens.touchTargetMin).toBe('44px');
  });

  it('should define soft and elevated shadow tokens', () => {
    const { shadows } = editorialTokens;
    expect(shadows.soft).toBeDefined();
    expect(shadows.elevated).toBeDefined();
    expect(shadows.soft).toContain('rgba(30, 30, 30');
  });
});

describe('WCAG 2.2 AA Contrast Mathematical Verification (F03)', () => {
  const { colors } = editorialTokens;

  it('should guarantee inkPrimary on canvas has contrast >= 15:1 (AAA standard)', () => {
    const ratio = getContrastRatio(colors.inkPrimary, colors.canvas);
    expect(ratio).toBeGreaterThanOrEqual(15.0);
  });

  it('should guarantee inkPrimary on white card has contrast >= 15:1 (AAA standard)', () => {
    const ratio = getContrastRatio(colors.inkPrimary, colors.card);
    expect(ratio).toBeGreaterThanOrEqual(15.0);
  });

  it('should guarantee inkMuted on canvas exceeds WCAG AA 4.5:1 ratio', () => {
    const ratio = getContrastRatio(colors.inkMuted, colors.canvas);
    expect(ratio).toBeGreaterThanOrEqual(6.0); // Typically ~6.5:1
  });

  it('should guarantee inkSubtle on canvas meets WCAG AA 4.5:1 ratio for body/micro text', () => {
    const ratio = getContrastRatio(colors.inkSubtle, colors.canvas);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should guarantee forestPrimary brand text on canvas exceeds 7:1 ratio', () => {
    const ratio = getContrastRatio(colors.forestPrimary, colors.canvas);
    expect(ratio).toBeGreaterThanOrEqual(7.0);
  });

  it('should guarantee forestPrimary text on forestLight tint exceeds 4.5:1 ratio', () => {
    const ratio = getContrastRatio(colors.forestPrimary, colors.forestLight);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should guarantee goldAccent UI elements meet >= 3:1 graphical/large text contrast', () => {
    const ratio = getContrastRatio(colors.goldAccent, colors.goldLight);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});
```

---

### 4.3 Component Test Suite Blueprint: `tests/components/layout.test.tsx`
Tests Header, MobileNav, Footer, Breadcrumbs, and SkipToContent using `@testing-library/react`.

```tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SkipToContent from '@/components/layout/SkipToContent';
import { CATEGORY_NAV_ITEMS } from '@/components/layout/Header';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/reunions',
}));

describe('SkipToContent Component (F03, F05)', () => {
  it('should render skip link targeting #main-content', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveClass('sr-only');
  });
});

describe('Header Component (F05)', () => {
  it('should render brand logo with home link', () => {
    render(<Header />);
    const logoLink = screen.getByRole('link', { name: /eternal paws home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render all primary category navigation items', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /^reunions$/i })).toHaveAttribute('href', '/reunions');
    expect(screen.getByRole('link', { name: /^hero dogs$/i })).toHaveAttribute('href', '/hero-dogs');
    expect(screen.getByRole('link', { name: /^rescues$/i })).toHaveAttribute('href', '/rescues');
    expect(screen.getByRole('link', { name: /^survival$/i })).toHaveAttribute('href', '/survival');
    expect(screen.getByRole('link', { name: /^loyalty$/i })).toHaveAttribute('href', '/loyalty');
    expect(screen.getByRole('link', { name: /^lost & found$/i })).toHaveAttribute('href', '/lost-and-found');
  });

  it('should mark active category link with aria-current="page"', () => {
    render(<Header />);
    const activeLink = screen.getByRole('link', { name: /^reunions$/i });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('should render search trigger with accessible label', () => {
    render(<Header />);
    const searchLink = screen.getByRole('link', { name: /search stories/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');
  });

  it('should render mobile menu toggle button with initial aria-expanded="false"', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /open main navigation menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('MobileNav Component (F04, F05)', () => {
  const handleClose = vi.fn();

  beforeEach(() => {
    handleClose.mockClear();
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <MobileNav isOpen={false} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render dialog with aria-modal="true" when isOpen is true', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} currentPath="/reunions" />
    );
    const dialog = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    const closeButton = screen.getByRole('button', { name: /close navigation menu/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render category and trust links in drawer', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    expect(screen.getByRole('link', { name: /fact-checking policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /editorial policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /corrections center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about eternal paws/i })).toBeInTheDocument();
  });
});

describe('Footer Component (F05)', () => {
  it('should render landmark role="contentinfo"', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render newsletter subscription section with input and submit button', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /join the pack/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe free/i })).toBeInTheDocument();
  });

  it('should render AI disclosure notice', () => {
    render(<Footer />);
    expect(screen.getByText(/ai disclosure notice/i)).toBeInTheDocument();
    expect(screen.getByText(/never use generative ai to fabricate stories/i)).toBeInTheDocument();
  });

  it('should render trust links and copyright statement', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /fact-checking charter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /corrections & retractions log/i })).toBeInTheDocument();
    expect(screen.getByText(/eternal paws media/i)).toBeInTheDocument();
  });
});

describe('Breadcrumbs Component (F05)', () => {
  const items = [
    { label: 'Reunions', href: '/reunions' },
    { label: 'Max Finds His Way Home', isCurrent: true },
  ];

  it('should render nav landmark with aria-label="Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it('should render Home root link and category parent link', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /reunions/i })).toHaveAttribute('href', '/reunions');
  });

  it('should mark current item with aria-current="page" and not render it as link', () => {
    render(<Breadcrumbs items={items} />);
    const currentItem = screen.getByText('Max Finds His Way Home');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
    expect(currentItem.closest('a')).toBeNull();
  });

  it('should embed valid Schema.org BreadcrumbList JSON-LD script', () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent || '{}');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement).toHaveLength(3); // Home + Reunions + Current
    expect(data.itemListElement[0].name).toBe('Home');
  });
});
```

---

## 5. Integration Checklist & Guidance for Implementer

When the builder agent starts constructing Milestone M1:

1. **Directories to Create**:
   - `components/layout/`
   - `tests/unit/`
   - `tests/components/`

2. **Files to Generate**:
   - `components/layout/SkipToContent.tsx`
   - `components/layout/Header.tsx`
   - `components/layout/MobileNav.tsx`
   - `components/layout/Footer.tsx`
   - `components/layout/Breadcrumbs.tsx`
   - `app/layout.tsx`
   - `tests/unit/design-system.test.ts`
   - `tests/components/layout.test.tsx`

3. **Validation Commands**:
   - `npx vitest run tests/unit/design-system.test.ts`
   - `npx vitest run tests/components/layout.test.tsx`
   - `npm run lint` / `npx tsc --noEmit`
