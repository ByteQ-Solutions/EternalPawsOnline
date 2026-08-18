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
        if (focusableElements.length === 0) return;

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
        className="fixed inset-0 bg-inkPrimary/60 backdrop-blur-sm transition-opacity duration-300"
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
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-white">
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
            className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-3 text-sm font-semibold text-white bg-forestPrimary hover:bg-forestHover rounded-md shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
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
