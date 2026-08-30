'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, HeartHandshake, PenTool, ChevronDown, Sparkles, ShieldCheck, HeartPulse, Apple, BookOpen, Compass } from 'lucide-react';
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
  { label: '🩺 Health & Wellness', href: '/wellness' },
  { label: '🍏 Food Safety', href: '/can-dogs-eat' },
];

export const STORY_CATEGORIES = [
  { label: 'Hero Dogs', href: '/hero-dogs', desc: 'Courageous canines saving lives' },
  { label: 'Reunions', href: '/reunions', desc: 'Heartwarming lost-and-found returns' },
  { label: 'Rescues', href: '/rescues', desc: 'Dramatic second chances & adoptions' },
  { label: 'Survival', href: '/survival', desc: 'Miraculous wilderness endurance' },
  { label: 'Loyalty', href: '/loyalty', desc: 'Unshakable devotion & bonds' },
];

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isStoriesDropdownOpen, setIsStoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile nav & dropdown on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsStoriesDropdownOpen(false);
  }, [pathname]);

  const isStoryActive = pathname === '/stories' || STORY_CATEGORIES.some((c) => pathname === c.href);
  const isWellnessActive = pathname?.startsWith('/wellness');
  const isFoodActive = pathname?.startsWith('/can-dogs-eat');

  return (
    <>
      <header
        role="banner"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-canvas/90 backdrop-blur-xl border-b border-borderLight shadow-soft py-2.5 sm:py-3'
            : 'bg-canvas/95 backdrop-blur-md border-b border-borderLight/60 py-3.5 sm:py-4'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Editorial Emblem */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-2.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-xl"
              aria-label="Eternal Paws Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forestPrimary flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-all duration-200">
                <HeartHandshake className="w-5 h-5 sm:w-5 sm:h-5 text-goldLight" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-inkPrimary group-hover:text-forestPrimary transition-colors leading-tight">
                  Eternal Paws
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-inkMuted hidden sm:block">
                  Verified True Dog Stories
                </span>
              </div>
            </Link>
          </div>

          {/* Modern Desktop Navigation Links */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1.5 xl:gap-2"
          >
            {/* 1. All Stories with Category Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsStoriesDropdownOpen(!isStoriesDropdownOpen)}
                onMouseEnter={() => setIsStoriesDropdownOpen(true)}
                aria-expanded={isStoriesDropdownOpen}
                aria-haspopup="true"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isStoryActive
                    ? 'text-forestPrimary bg-forestLight/80 shadow-xs'
                    : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
                }`}
              >
                <BookOpen className="w-4 h-4 text-forestPrimary/80" />
                <span>Stories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {isStoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setIsStoriesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-72 bg-canvas border border-borderLight rounded-2xl shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <Link
                    href="/stories"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-forestLight/60 text-xs font-bold text-forestPrimary transition-colors border-b border-borderLight/60 mb-1"
                  >
                    <span>Browse All Stories</span>
                    <span className="text-[10px] bg-forestPrimary text-white px-2 py-0.5 rounded-full">32+</span>
                  </Link>

                  <div className="space-y-0.5">
                    {STORY_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="flex flex-col p-2.5 rounded-xl hover:bg-cardMuted transition-colors group"
                      >
                        <span className="text-sm font-bold text-inkPrimary group-hover:text-forestPrimary">
                          {cat.label}
                        </span>
                        <span className="text-[11px] text-inkMuted leading-tight">
                          {cat.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Health & Wellness Hub */}
            <Link
              href="/wellness"
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isWellnessActive
                  ? 'text-forestPrimary bg-forestLight/80 shadow-xs'
                  : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-red-500" />
              <span>Health & Wellness</span>
            </Link>

            {/* 3. Canine Food Safety */}
            <Link
              href="/can-dogs-eat"
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isFoodActive
                  ? 'text-forestPrimary bg-forestLight/80 shadow-xs'
                  : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
              }`}
            >
              <Apple className="w-4 h-4 text-emerald-600" />
              <span>Food Safety</span>
            </Link>

            {/* 4. Editorial & Trust Standards */}
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/about'
                  ? 'text-forestPrimary bg-forestLight/80 shadow-xs'
                  : 'text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-forestPrimary/80" />
              <span>About</span>
            </Link>
          </nav>

          {/* Utility Controls & Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <Link
              href="/search"
              aria-label="Search stories, dog breeds, food safety or symptoms"
              className="w-10 h-10 rounded-full text-inkMuted hover:text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors border border-borderLight/60 shadow-xs"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </Link>

            {/* Submit Story CTA Pill */}
            <Link
              href="/submit-story"
              prefetch={false}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-forestPrimary hover:bg-forestHover rounded-full shadow-soft hover:shadow-medium transition-all duration-200"
            >
              <PenTool className="w-3.5 h-3.5 text-goldLight" aria-hidden="true" />
              <span>Submit Story</span>
            </Link>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Open main navigation menu"
              className="lg:hidden w-10 h-10 rounded-full text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors border border-borderLight/60 shadow-xs"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentPath={pathname || ''}
      />
    </>
  );
};

export default Header;
