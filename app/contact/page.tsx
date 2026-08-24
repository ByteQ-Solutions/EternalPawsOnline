import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ShieldCheck } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Our Newsroom | Eternal Paws',
  description: 'Get in touch with the Eternal Paws editorial team, press desk, or fact-checking board.',
};

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} className="mb-6" />

        <header className="space-y-4 pb-8 border-b border-borderLight text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Editorial Newsroom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-inkPrimary tracking-tight leading-tight">
            Contact Eternal Paws
          </h1>
          <p className="text-inkMuted leading-relaxed">
            Have a question, feedback, story tip, or press inquiry? We would love to hear from you.
          </p>
        </header>

        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-2xl border border-borderLight space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forestLight text-forestPrimary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-inkPrimary">General Inquiries</h3>
            <p className="text-sm text-inkMuted">For editorial questions, feedback, or partnerships:</p>
            <a href="mailto:contact@eternalpaws.online" className="text-sm font-bold text-forestPrimary hover:underline block">
              contact@eternalpaws.online
            </a>
          </div>

          <div className="p-6 bg-card rounded-2xl border border-borderLight space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forestLight text-forestPrimary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-inkPrimary">Fact-Checking & Corrections</h3>
            <p className="text-sm text-inkMuted">To report inaccuracies or submit corroborating documents:</p>
            <Link href="/corrections" className="text-sm font-bold text-forestPrimary hover:underline block">
              Submit a Correction &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
