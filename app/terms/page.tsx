import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service | Eternal Paws',
  description: 'Terms and conditions governing the use of the Eternal Paws publication platform.',
};

export default function TermsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} className="mb-6" />

        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-inkSubtle">
            Effective Date: August 18, 2026
          </p>
        </header>

        <article className="py-8 space-y-8 text-inkPrimary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">1. Agreement to Terms</h2>
            <p className="text-inkMuted leading-relaxed">
              By accessing and reading Eternal Paws (https://eternalpaws.online), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">2. User Story Submissions & Intellectual Property</h2>
            <p className="text-inkMuted leading-relaxed">
              When submitting stories, photographs, or materials to Eternal Paws via our Submit Story portal, you grant Eternal Paws a non-exclusive, worldwide, royalty-free license to edit, fact-check, publish, and syndicate the story. You warrant that you own or have the necessary rights and permissions to submit such photographs and stories.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">3. Fact-Checking and Corrections</h2>
            <p className="text-inkMuted leading-relaxed">
              Eternal Paws maintains a strict 4-Tier Verification Charter. If any story contains factual inaccuracies, readers and parties may submit correction requests via our <Link href="/corrections" className="text-forestPrimary underline">Corrections Portal</Link>.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
