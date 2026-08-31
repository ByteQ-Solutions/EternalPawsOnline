'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search, HeartHandshake, ShieldCheck, FileText, HelpCircle, AlertCircle, PenTool, HeartPulse, Apple, BookOpen, PhoneCall, Calculator } from 'lucide-react';
import { STORY_CATEGORIES } from './Header';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export const TRUST_NAV_ITEMS = [
  { label: 'About Eternal Paws', href: '/about', icon: HelpCircle },
  { label: 'Fact-Checking Policy', href: '/fact-checking', icon: ShieldCheck },
  { label: 'Editorial Standards', href: '/editorial-policy', icon: FileText },
  { label: 'Corrections Center', href: '/corrections', icon: AlertCircle },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentPath = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & keyboard management
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
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
        className="relative ml-auto w-full max-w-sm bg-canvas h-full shadow-elevated border-l border-borderLight flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-300 ease-out"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-borderLight bg-canvas">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forestPrimary flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4 text-goldLight" aria-hidden="true" />
              </div>
              <span className="font-serif text-lg font-bold text-inkPrimary">
                Eternal Paws
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="w-9 h-9 rounded-full text-inkMuted hover:text-inkPrimary hover:bg-cardMuted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="p-4 border-b border-borderLight/60">
            <Link
              href="/search"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 bg-card border border-borderLight rounded-xl text-inkMuted hover:text-inkPrimary transition-colors text-sm shadow-xs"
            >
              <Search className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
              <span>Search stories, breeds, foods...</span>
            </Link>
          </div>

          {/* Primary Hub Links */}
          <div className="p-4 space-y-2 border-b border-borderLight/60">
            <Link
              href="/wellness"
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                currentPath.startsWith('/wellness')
                  ? 'bg-forestLight/80 text-forestPrimary font-bold'
                  : 'bg-card border border-borderLight hover:bg-cardMuted text-inkPrimary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">🩺 Health & Wellness Hub</span>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
            </Link>

            <Link
              href="/can-dogs-eat"
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                currentPath.startsWith('/can-dogs-eat')
                  ? 'bg-forestLight/80 text-forestPrimary font-bold'
                  : 'bg-card border border-borderLight hover:bg-cardMuted text-inkPrimary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Apple className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">🍏 Canine Food Safety</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">26+ Guides</span>
            </Link>

            <Link
              href="/tools"
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                currentPath.startsWith('/tools')
                  ? 'bg-forestLight/80 text-forestPrimary font-bold'
                  : 'bg-card border border-borderLight hover:bg-cardMuted text-inkPrimary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold">🧮 Interactive Calculators</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">FREE TOOLS</span>
            </Link>
          </div>

          {/* Story Categories */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                True Dog Stories
              </span>
              <Link
                href="/stories"
                onClick={onClose}
                className="text-xs font-bold text-forestPrimary hover:underline"
              >
                View All (32) &rarr;
              </Link>
            </div>

            <nav className="space-y-1" aria-label="Mobile Story Categories">
              {STORY_CATEGORIES.map((cat) => {
                const isActive = currentPath === cat.href;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-forestPrimary bg-forestLight/80 font-bold'
                        : 'text-inkPrimary hover:bg-cardMuted'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-inkSubtle">&rarr;</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Trust & Editorial */}
          <div className="p-4 border-t border-borderLight/60">
            <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle block mb-2">
              Trust & Standards
            </span>
            <div className="space-y-1">
              {TRUST_NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-inkMuted hover:text-inkPrimary hover:bg-cardMuted transition-colors"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-forestPrimary" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer CTA & 24/7 Hotline */}
        <div className="p-4 border-t border-borderLight bg-card space-y-2.5">
          <Link
            href="/submit-story"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-white bg-forestPrimary hover:bg-forestHover rounded-full shadow-soft transition-all"
          >
            <PenTool className="w-3.5 h-3.5 text-goldLight" />
            <span>Submit a True Dog Story</span>
          </Link>

          <a
            href="tel:8884264435"
            className="flex items-center justify-center gap-1.5 w-full py-1 text-[11px] text-amber-800 font-semibold hover:underline"
          >
            <PhoneCall className="w-3 h-3 text-amber-600" />
            24/7 Pet Poison Helpline: (888) 426-4435
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
