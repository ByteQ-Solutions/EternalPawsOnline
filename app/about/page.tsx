import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Heart, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Our Mission & Editorial Board | Eternal Paws',
  description:
    'Dedicated to celebrating canine devotion through 100% verified, true emotional stories. Learn about our fact-checking standards, editorial team, and shelter advocacy.',
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'About Us' }]} className="mb-6" />

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Journalistic Truth in Pet Media</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Honoring Canine Devotion Through 100% Verified Truth
          </h1>
          <p className="text-lg sm:text-xl text-inkMuted leading-relaxed">
            In an era of viral AI fakes and scripted reunion videos, Eternal Paws was founded on a simple pledge: <em>every story we publish is real, corroborated, and anchored in verified truth.</em>
          </p>
        </header>

        {/* Core Mission & Commitment */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Our Mission & Truth Commitment
          </h2>
          <div className="p-6 rounded-xl bg-forestLight/50 border border-forestPrimary/20 space-y-3">
            <h3 className="font-serif text-lg font-bold text-forestPrimary">
              The Eternal Paws Truth Commitment
            </h3>
            <p className="text-sm sm:text-base text-inkPrimary leading-relaxed">
              <strong>Mission:</strong> To celebrate the extraordinary bond between humans and dogs through 100% verified, true emotional stories.
            </p>
            <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
              <strong>Commitment to Truth:</strong> Zero fabricated narratives, zero misleading headlines, full public source attribution.
            </p>
          </div>
          <p className="text-inkMuted leading-relaxed">
            Dogs give us unconditional loyalty, unmatched courage, and boundless love. They deserve storytelling that respects their reality. We never exaggerate medical conditions, script dramatic reunions, or publish unverified claims for social media engagement.
          </p>
        </section>

        {/* The Misinformation Problem */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Why Verified Dog Journalism Matters
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Social media platforms are saturated with staged rescue videos, synthetic AI pet dramas, and recycled hoaxes designed to generate clicks. This fake content harms real animal welfare:
          </p>
          <ul className="space-y-3 text-inkPrimary">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Distorts public expectations:</strong> Fabricated recovery timelines create unrealistic expectations for adopters rehabilitating traumatized rescue dogs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Diverts support from authentic shelters:</strong> Fake donation links and staged rescues siphon vital funding away from legitimate 501(c)(3) animal shelters.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Erodes community trust:</strong> When readers discover a beloved viral story was faked, it diminishes faith in all genuine canine search and rescue efforts.
              </span>
            </li>
          </ul>
        </section>

        {/* Editorial Standards Overview */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Our 4-Tier Verification Standard
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Every story published on Eternal Paws undergoes rigorous fact-checking before receiving an editorial trust rating. We inspect official shelter intake logs, municipal licensing dockets, veterinary clinical records, and sworn law enforcement dispatch logs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-card border border-borderLight space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-forestPrimary text-sm">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Primary Record Corroboration</span>
              </div>
              <p className="text-xs text-inkMuted">
                Direct cross-examination of medical records, microchip telemetry, and police search reports.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-borderLight space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#8A5200] text-sm">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>Transparent Public Trust Cards</span>
              </div>
              <p className="text-xs text-inkMuted">
                Every story includes full citations, confidence scores, fact-checker names, and direct links to public records.
              </p>
            </div>
          </div>
          <div className="pt-2">
            <Link
              href="/fact-checking"
              className="inline-flex items-center gap-2 text-forestPrimary font-semibold hover:underline text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded"
            >
              <span>Explore our full Fact-Checking Rubric & Methodology</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Editorial Board & Bios */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Editorial Board & Fact-Checkers
          </h2>
          <div className="space-y-6">
            <div className="p-5 rounded-lg bg-card border border-borderLight space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-serif text-lg font-bold text-inkPrimary">
                  Elena Rostova
                </h3>
                <span className="text-xs font-semibold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full self-start">
                  Senior Fact-Checker & Investigative Editor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Former investigative journalist with 12 years of experience covering animal welfare, municipal emergency services, and search-and-rescue canine deployments. Elena leads our primary record audit process.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-card border border-borderLight space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-serif text-lg font-bold text-inkPrimary">
                  Dr. Sarah Jenkins, DVM
                </h3>
                <span className="text-xs font-semibold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full self-start">
                  Veterinary Medical Advisor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Board-certified emergency veterinary specialist with over 15 years in high-altitude trauma and wilderness canine rescue recovery. Dr. Jenkins reviews all medical claims, trauma diagnostics, and recovery timelines.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-card border border-borderLight space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-serif text-lg font-bold text-inkPrimary">
                  Marcus Vance
                </h3>
                <span className="text-xs font-semibold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full self-start">
                  Editorial Director & Animal Welfare Liaison
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Lifelong canine advocate and former director of shelter communications. Marcus oversees ethical storytelling guidelines, community submissions, and partnerships with non-profit shelters nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* Canine Advocacy Statement */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Canine Advocacy & Shelter Partnerships
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Eternal Paws donates a portion of all platform proceeds to verified non-profit animal shelters, search-and-rescue canine training units, and low-cost microchipping clinics. We actively advocate for:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cardMuted/60 border border-borderLight space-y-1">
              <h4 className="font-semibold text-inkPrimary text-sm">Universal Microchipping</h4>
              <p className="text-xs text-inkMuted">
                Educating pet guardians on registered ISO microchips as the #1 tool for lost dog reunions.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cardMuted/60 border border-borderLight space-y-1">
              <h4 className="font-semibold text-inkPrimary text-sm">SAR Canine Funding</h4>
              <p className="text-xs text-inkMuted">
                Supporting volunteer wilderness and avalanche search dog units with protective gear and medical kits.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cardMuted/60 border border-borderLight space-y-1">
              <h4 className="font-semibold text-inkPrimary text-sm">Ethical Rescue Adoption</h4>
              <p className="text-xs text-inkMuted">
                Spotlighting special-needs, senior, and prosthetic-pioneer dogs who prove resilience has no limits.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Links */}
        <section className="py-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-inkPrimary">
            Have a True Dog Story to Share?
          </h3>
          <p className="text-sm text-inkMuted max-w-md mx-auto">
            Submit your dog&apos;s verified rescue, reunion, or loyalty story to our fact-checking desk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/submit-story"
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-forestPrimary hover:bg-forestPrimary/90 text-white font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary flex items-center justify-center"
            >
              Submit a True Story
            </Link>
            <Link
              href="/editorial-policy"
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-card hover:bg-cardMuted text-inkPrimary border border-borderLight font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary flex items-center justify-center"
            >
              Read Editorial Policy
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
