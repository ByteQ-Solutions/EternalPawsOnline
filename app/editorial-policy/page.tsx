import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Editorial Policy & Verification Charter | Eternal Paws',
  description:
    'Our commitment to journalistic integrity, rigorous source corroboration, transparent AI visual disclosures, and honest anti-clickbait reporting.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Editorial Policy' }]} className="mb-6" />

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Standards & Guidelines</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Editorial Policy & Verification Charter
          </h1>
          <p className="text-lg sm:text-xl text-inkMuted leading-relaxed">
            Eternal Paws is built upon four foundational pillars of journalistic integrity. We hold pet storytelling to the same rigorous evidentiary standards as traditional investigative newsrooms.
          </p>
        </header>

        {/* Pillar 1: Source Corroboration Standard */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <div className="flex items-center gap-2 text-forestPrimary font-bold text-sm uppercase tracking-wider">
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>Pillar 1</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Source Corroboration Standard
          </h2>
          <p className="text-inkMuted leading-relaxed">
            We believe extraordinary claims require verifiable evidence. Our editorial desk prioritizes primary, institutional records over anonymous hearsay or unverified social media clips:
          </p>
          <ul className="space-y-3 text-inkPrimary text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Institutional Record Verification:</strong> Every &apos;Strongly Verified&apos; story requires at least two independent institutional records—such as 501(c)(3) shelter intake dossiers, municipal licensing registrations, police dispatch logs, or licensed DVM veterinary charts.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Multi-Source Corroboration:</strong> Eyewitness submissions must be corroborated by local emergency service records or named journalistic sources before receiving editorial endorsement.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Public Record Traceability:</strong> Wherever permitted by law and privacy considerations, we provide direct document reference IDs and verified public links in our story Trust Cards.
              </span>
            </li>
          </ul>
        </section>

        {/* Pillar 2: Animal Welfare & Privacy Protections */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <div className="flex items-center gap-2 text-forestPrimary font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Pillar 2</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Animal Welfare & Privacy Protections
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Our reporting is guided first and foremost by the physical and psychological well-being of the animals and families we feature:
          </p>
          <ul className="space-y-3 text-inkPrimary text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Zero Exploitation of Trauma:</strong> We do not publish graphic distress imagery or glorify dangerous situations that endanger animals for entertainment.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Foster & Adopter Privacy:</strong> To protect rescue animals and adoptive families from unwanted solicitation or harassment, exact residential addresses and sensitive contact information are strictly withheld.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Informed Consent:</strong> All contributor submissions and family interviews are conducted with transparent consent regarding story publication and photography usage.
              </span>
            </li>
          </ul>
        </section>

        {/* Pillar 3: AI Media Disclosure Standards */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <div className="flex items-center gap-2 text-[#8A5200] font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-goldAccent" aria-hidden="true" />
            <span>Pillar 3</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            AI Media Disclosure Standards
          </h2>
          <p className="text-inkMuted leading-relaxed">
            We maintain strict, uncompromising boundaries regarding the use of generative artificial intelligence:
          </p>
          <div className="p-4 rounded-lg bg-[#FEF7EC] border border-[#C97A1E]/30 text-inkPrimary space-y-2 text-sm">
            <h3 className="font-bold text-[#8A5200]">
              Our Anti-Fabrication Pledge
            </h3>
            <p className="text-inkMuted leading-relaxed">
              <strong>We NEVER use generative AI to write, fabricate, or embellish stories.</strong> Every narrative on Eternal Paws is authored and fact-checked by human journalists based on real events.
            </p>
          </div>
          <ul className="space-y-3 text-inkPrimary text-sm sm:text-base pt-2">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Mandatory Visual Reconstruction Disclosure:</strong> In rare cases where historical emergency events occurred before cameras were present, high-fidelity visual reconstructions may be generated strictly based on verified veterinary blueprints and witness logs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Unambiguous UI Labeling:</strong> Any synthetic image is prominently marked with our gold disclosure badge: <em>&quot;AI Visual Reconstruction • Transparency Disclosed&quot;</em> alongside the tool used and editorial rationale.
              </span>
            </li>
          </ul>
        </section>

        {/* Pillar 4: No Clickbait / No Deceptive Framing Charter */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <div className="flex items-center gap-2 text-forestPrimary font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Pillar 4</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            No Clickbait / No Deceptive Framing Charter
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Our headlines, excerpts, and social previews tell readers exactly what happened without manipulative tricks:
          </p>
          <ul className="space-y-3 text-inkPrimary text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Accurate Headlines:</strong> We never use vague pronouns (&quot;You won&apos;t believe what happened next...&quot;) or synthetic emotional cliffhangers.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>No Dark Patterns:</strong> We do not employ fake countdown timers, deceptive exit popups, or intrusive subscription overlays.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forestPrimary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Transparent Read Times:</strong> Reading time estimates reflect actual word counts computed at 200 words per minute.
              </span>
            </li>
          </ul>
        </section>

        {/* Corrections & Retractions Policy */}
        <section className="py-8 space-y-4 border-b border-borderLight">
          <div className="flex items-center gap-2 text-forestPrimary font-bold text-sm uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Accountability</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Corrections & Retractions Protocol
          </h2>
          <p className="text-inkMuted leading-relaxed">
            When factual errors occur, we correct them swiftly, visibly, and transparently. We do not stealth-edit stories.
          </p>
          <div className="p-4 rounded-lg bg-card border border-borderLight space-y-2 text-sm">
            <p className="text-inkPrimary">
              <strong>Our 24-48 Hour Intake SLA:</strong> All reader corrections submitted through our Trust Cards or public corrections form are logged in our internal tracking system and reviewed against primary documentation within 48 hours.
            </p>
            <p className="text-inkMuted">
              Approved corrections are published with timestamped revision notices directly on the article and recorded in our permanent public corrections ledger.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/corrections"
              className="inline-flex items-center gap-2 text-forestPrimary font-semibold hover:underline text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded"
            >
              <span>View the Public Corrections Log or Submit a Factual Inquiry &rarr;</span>
            </Link>
          </div>
        </section>

        {/* Commercial Independence */}
        <section className="py-8 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Commercial Independence & Safe Display Monetization
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Eternal Paws maintains total separation between our editorial decisions and commercial advertising partners. We never accept sponsored content disguised as true news stories, and our display ad placements are strictly isolated from story text with anti-CLS layout reservations.
          </p>
        </section>
      </Container>
    </div>
  );
}
