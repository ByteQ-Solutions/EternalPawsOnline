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
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
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
            {/* Language Switcher Toggle (EN / ES) */}
            <div
              className="flex items-center bg-cardMuted border border-borderLight rounded-full p-0.5"
              role="group"
              aria-label="Language selection"
            >
              <Link
                href="/"
                aria-label="Switch to English"
                className={`min-h-[36px] min-w-[36px] px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                  !pathname?.startsWith('/es')
                    ? 'bg-forestPrimary text-white shadow-soft'
                    : 'text-inkMuted hover:text-inkPrimary'
                }`}
              >
                EN
              </Link>
              <Link
                href="/es"
                aria-label="Cambiar a Español"
                className={`min-h-[36px] min-w-[36px] px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                  pathname?.startsWith('/es')
                    ? 'bg-forestPrimary text-white shadow-soft'
                    : 'text-inkMuted hover:text-inkPrimary'
                }`}
              >
                ES
              </Link>
            </div>

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
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs md:text-sm font-semibold text-white bg-forestPrimary hover:bg-forestHover rounded-md shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
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
        currentPath={pathname || ''}
      />
    </>
  );
};

export default Header;
