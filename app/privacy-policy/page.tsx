import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | Eternal Paws',
  description: 'Our transparent privacy policy covering cookies, advertising partners, data protection, and user rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} className="mb-6" />

        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-inkSubtle">
            Last Updated: August 2026 • Effective Date: August 18, 2026
          </p>
        </header>

        <article className="py-8 space-y-8 text-inkPrimary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">1. Introduction</h2>
            <p className="text-inkMuted leading-relaxed">
              At Eternal Paws (accessible from https://eternalpaws.online), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of personal information that is collected and recorded by Eternal Paws and how we use it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">2. Information We Collect</h2>
            <p className="text-inkMuted leading-relaxed">
              When you visit Eternal Paws, submit a dog story, subscribe to our weekly newsletter, or contact our newsroom, we may collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-inkMuted pl-2">
              <li><strong>Voluntary Submissions:</strong> Your name, email address, story details, and pet photographs when you submit a story or contact us.</li>
              <li><strong>Newsletter Signups:</strong> Your email address for delivering the Sunday True Dog Story digest.</li>
              <li><strong>Log Data:</strong> Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">3. Cookies and Advertising Partners</h2>
            <p className="text-inkMuted leading-relaxed">
              Eternal Paws uses standard cookies to store information about visitors preferences and record user-specific information on which pages the user accesses or visits.
            </p>
            <div className="p-4 bg-card rounded-xl border border-borderLight space-y-2 text-sm">
              <strong className="text-inkPrimary block">Google DoubleClick DART Cookie & Third-Party Vendors:</strong>
              <p className="text-inkMuted">
                Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to eternalpaws.online and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">4. GDPR & CCPA Compliance</h2>
            <p className="text-inkMuted leading-relaxed">
              Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to request access, rectification, or deletion of your personal data, and to opt out of the sale or sharing of personal information. Contact our Data Protection Officer at privacy@eternalpaws.online to exercise your rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">5. Contact Our Privacy Officer</h2>
            <p className="text-inkMuted leading-relaxed">
              If you have additional questions or require more information about our Privacy Policy, please contact our editorial desk via email at <a href="mailto:privacy@eternalpaws.online" className="text-forestPrimary underline">privacy@eternalpaws.online</a> or through our <Link href="/corrections" className="text-forestPrimary underline">Corrections & Inquiries</Link> desk.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
