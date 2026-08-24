'use client';

/**
 * Eternal Paws Platform - Editorial Admin Login Portal
 * Path: app/admin/login/page.tsx
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { AuthService } from '@/lib/auth/auth-service';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || 'Invalid email address or password.');
        setIsLoading(false);
        return;
      }

      try {
        localStorage.setItem('eternal_paws_admin_session', JSON.stringify(data.user));
      } catch {
        // Ignore storage errors
      }

      // Direct browser redirect to admin dashboard
      window.location.href = '/admin';
    } catch {
      setError('Network error during authentication. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-canvas flex items-center justify-center py-12 px-4 sm:px-6">
      <Container className="max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="w-10 h-10 rounded-full bg-forestPrimary flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-goldLight" aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl font-bold text-inkPrimary">Eternal Paws</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-inkPrimary">Editorial Staff Sign-In</h1>
          <p className="text-xs text-inkMuted mt-1">
            Restricted access for fact-checkers, editors, and newsroom staff.
          </p>
        </div>

        <Card className="bg-card border-borderLight rounded-2xl shadow-elevated p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="admin-email"
              label="Staff Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            <Input
              id="admin-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-error">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full min-h-[48px] font-bold text-base"
            >
              Sign In to Editorial Desk <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-borderLight/80 text-center text-[11px] text-inkSubtle flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forestPrimary" />
            <span>Secure 256-Bit Encrypted Newsroom Portal</span>
          </div>
        </Card>
      </Container>
    </main>
  );
}
