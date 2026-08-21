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
                className="min-h-[44px] px-5 py-2.5 bg-forestPrimary hover:bg-forestHover text-white font-semibold text-sm rounded-md shadow-soft transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
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
              <span className="w-8 h-8 rounded-full bg-forestPrimary flex items-center justify-center text-white">
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
                  prefetch={false}
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Fact-Checking Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  prefetch={false}
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Editorial Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/corrections"
                  prefetch={false}
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  Corrections & Retractions Log
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  prefetch={false}
                  className="text-sm text-inkMuted hover:text-forestPrimary hover:underline min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-sm"
                >
                  About Our Newsroom
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-story"
                  prefetch={false}
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
              prefetch={false}
              className="hover:text-inkPrimary min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/editorial-policy#terms"
              prefetch={false}
              className="hover:text-inkPrimary min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              Terms of Service
            </Link>
            <Link
              href="/corrections"
              prefetch={false}
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
