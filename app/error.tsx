'use client';

/**
 * Eternal Paws Platform - Global Client Error Recovery Boundary
 * Path: app/error.tsx
 * 
 * Catches runtime exceptions and provides retry recovery, home navigation,
 * and editorial support reporting links.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F15
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { Container } from '@/design-system/components/Container';

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception to monitoring
    console.error('Unhandled platform rendering error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <Container size="reading">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-borderLight shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-goldLight text-goldAccent flex items-center justify-center mx-auto" aria-hidden="true">
            <AlertCircle className="w-8 h-8 text-goldAccent" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-goldAccent block">
              Application Recovery Boundary
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-inkPrimary tracking-tight">
              Something Unexpected Occurred
            </h1>
            <p className="font-sans text-base text-inkMuted leading-relaxed max-w-md mx-auto">
              We encountered a temporary technical glitch while loading this page. Our editorial systems have logged the event.
            </p>
          </div>

          {error.digest && (
            <div className="p-3 rounded-lg bg-cardMuted border border-borderLight text-xs font-mono text-inkSubtle max-w-sm mx-auto">
              Error Digest: {error.digest}
            </div>
          )}

          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-colors shadow-soft inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-cardMuted hover:bg-forestLight text-inkPrimary hover:text-forestPrimary font-semibold text-sm border border-borderLight transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Home className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
              <span>Return to Home Feed</span>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="pt-6 border-t border-borderLight text-xs text-inkSubtle flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              Need help? Contact our team at{' '}
              <a
                href="mailto:corrections@eternal-paws.com"
                className="underline text-forestPrimary hover:text-forestPrimary/80 font-medium"
              >
                corrections@eternal-paws.com
              </a>
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}
