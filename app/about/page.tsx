import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Heart, Award, Users, ArrowRight, CheckCircle2, BookOpen, Stethoscope, Scale } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Our Mission, Research & Editorial Standards | Eternal Paws',
  description:
    'Dedicated to celebrating canine devotion through 100% verified, true emotional stories and veterinary-researched health guides. Learn about our authentic research methodology and institutional sources.',
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12 bg-sand text-ink">
      <Container size="reading">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'About Us' }]} className="mb-6" />

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />
            <span>Independent Journalistic Integrity</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Honoring Canine Devotion Through 100% Verified Truth
          </h1>
          <p className="text-lg sm:text-xl text-inkMuted leading-relaxed">
            In an era of viral AI fabrications and staged pet dramas, Eternal Paws was established with a singular, unwavering pledge: <em>every story and health guide we publish is grounded in real-world facts, official documentation, and peer-reviewed veterinary science.</em>
          </p>
        </header>

        {/* Core Mission & Commitment */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Our Mission & Truth Commitment
          </h2>
          <div className="p-6 rounded-2xl bg-forestLight/50 border border-forestPrimary/20 space-y-3 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-forestPrimary">
              The Eternal Paws Editorial Pledge
            </h3>
            <p className="text-sm sm:text-base text-inkPrimary leading-relaxed">
              <strong>Our Mission:</strong> To document the loyalty, heroism, and emotional resilience of dogs through authentic, verified reporting that uplifts pet parents and supports real animal welfare.
            </p>
            <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
              <strong>Commitment to Honesty:</strong> Zero manufactured drama, zero deceptive clickbait, and 100% public source attribution for every rescue and reunion featured on our platform.
            </p>
          </div>
          <p className="text-inkMuted leading-relaxed text-sm sm:text-base">
            Dogs offer humanity unconditional loyalty, courage, and companionship. They deserve storytelling that respects their reality. We never exaggerate medical conditions, script dramatic reunions, or publish unverified claims for social media engagement.
          </p>
        </section>

        {/* Why Authentic Dog Media Matters */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Why Verified Dog Journalism Matters
          </h2>
          <p className="text-inkMuted leading-relaxed text-sm sm:text-base">
            Digital platforms are increasingly inundated with staged rescue videos, synthetic pet stories, and misleading claims. This misinformation causes genuine harm:
          </p>
          <ul className="space-y-3.5 text-inkPrimary text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Distorts public expectations:</strong> Fabricated recovery timelines create unrealistic expectations for adopters rehabilitating traumatized shelter dogs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Diverts support from authentic shelters:</strong> Fake donation links and staged rescues siphon vital funding away from legitimate non-profit animal shelters.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Erodes community trust:</strong> When readers discover a viral pet story was faked, it diminishes faith in genuine canine search and rescue efforts.
              </span>
            </li>
          </ul>
        </section>

        {/* How We Research & Verify Medical / Veterinary Content */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Our Institutional Veterinary & Health Research Framework
          </h2>
          <p className="text-inkMuted leading-relaxed text-sm sm:text-base">
            We take canine health and nutrition seriously. Our editorial team does not invent medical advice or promote unproven fads. Every nutritional food guide, emergency first-aid protocol, and behavioral analysis is synthesized directly from gold-standard veterinary authorities:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-card border border-borderLight space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-forestPrimary text-sm">
                <Stethoscope className="w-4 h-4 text-forestPrimary" />
                <span>ASPCA Animal Poison Control (APCC)</span>
              </div>
              <p className="text-xs text-inkMuted leading-relaxed">
                Toxicology baselines, theobromine thresholds, and emergency decontamination protocols directly aligned with ASPCA clinical criteria.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-borderLight space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-forestPrimary text-sm">
                <BookOpen className="w-4 h-4 text-forestPrimary" />
                <span>American Veterinary Medical Association (AVMA)</span>
              </div>
              <p className="text-xs text-inkMuted leading-relaxed">
                Clinical standards for heatstroke emergency management, preventive senior care, and surgical interventions (such as GDV gastropexy).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-borderLight space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-forestPrimary text-sm">
                <ShieldCheck className="w-4 h-4 text-forestPrimary" />
                <span>Merck Veterinary Manual & JAVMA</span>
              </div>
              <p className="text-xs text-inkMuted leading-relaxed">
                Peer-reviewed pharmacological data, canine behavioral ethology, and evidence-based nutritional serving guidelines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-borderLight space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-forestPrimary text-sm">
                <Scale className="w-4 h-4 text-forestPrimary" />
                <span>American Kennel Club (AKC) Health Archives</span>
              </div>
              <p className="text-xs text-inkMuted leading-relaxed">
                Breed-specific predispositions, life stage milestones, and safe treat preparation guidelines.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Desk Structure */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            The Eternal Paws Editorial & Research Desks
          </h2>
          <p className="text-inkMuted leading-relaxed text-sm sm:text-base">
            Eternal Paws operates through specialized editorial desks dedicated to thorough research, multi-source corroboration, and community engagement:
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-borderLight space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-inkPrimary">
                  Primary Record & Public Dispatch Research Desk
                </h3>
                <span className="text-[11px] font-bold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full">
                  Fact-Checking
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Responsible for cross-referencing law enforcement incident blotters, fire department technical rescue mission reports, and municipal shelter intake logs before any story receives our verified badge.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-borderLight space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-inkPrimary">
                  Canine Health & Nutrition Research Desk
                </h3>
                <span className="text-[11px] font-bold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full">
                  Veterinary Science
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Synthesizes peer-reviewed veterinary literature, ASPCA poison control bulletins, and nutritional safety charts to ensure our Food Safety and Wellness guides remain accurate and up-to-date.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-borderLight space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-inkPrimary">
                  Community Submissions & Story Curation Desk
                </h3>
                <span className="text-[11px] font-bold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full">
                  Editorial Care
                </span>
              </div>
              <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                Reviews reader-submitted stories, verifies ownership records, coordinates photo permissions, and crafts emotional narratives that honor the genuine spirit of each dog&apos;s journey.
              </p>
            </div>
          </div>
        </section>

        {/* Fact-Checking & Transparency Links */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
            Our Transparent Editorial Standards
          </h2>
          <p className="text-inkMuted leading-relaxed text-sm">
            We invite readers to review our complete verification charters, correction submission procedures, and privacy policies:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/fact-checking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-borderLight text-xs font-bold text-forestPrimary hover:bg-forestLight transition-colors"
            >
              <span>Fact-Checking Rubric</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-borderLight text-xs font-bold text-forestPrimary hover:bg-forestLight transition-colors"
            >
              <span>Editorial Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/corrections"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-borderLight text-xs font-bold text-forestPrimary hover:bg-forestLight transition-colors"
            >
              <span>Corrections Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-inkPrimary">
            Have a True Dog Story to Share?
          </h3>
          <p className="text-sm text-inkMuted max-w-md mx-auto">
            Submit your dog&apos;s rescue, reunion, or heroic loyalty journey to our verification desk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/submit-story"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-forestPrimary hover:bg-forestHover text-white font-bold text-sm shadow-soft transition-colors flex items-center justify-center"
            >
              Submit a True Story
            </Link>
            <Link
              href="/wellness"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-card hover:bg-cardMuted text-inkPrimary border border-borderLight font-bold text-sm shadow-xs transition-colors flex items-center justify-center"
            >
              Explore Health & Wellness
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
