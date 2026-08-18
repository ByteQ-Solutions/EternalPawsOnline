import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, FileText, Building2, UserCheck, Shield } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VerificationBadge } from '@/components/trust/VerificationBadge';

export const metadata: Metadata = {
  title: 'How Eternal Paws Fact-Checks Dog Stories | Fact-Checking Charter',
  description:
    'Detailed breakdown of our 4-tier verification calculus, source confidence weighting matrix, and multi-step editorial corroboration pipeline.',
};

export default function FactCheckingPage() {
  const tiers = [
    {
      status: 'Strongly Verified' as const,
      minScore: 90,
      badgeText: 'Strongly Verified',
      colorClass: 'bg-forestLight text-forestPrimary border-forestPrimary/30',
      description: 'Multiple primary institutional sources with documentary corroboration.',
      requirements: [
        'At least 2 distinct institutional records (e.g. Police SAR log + Veterinary hospital chart).',
        'Official tracking numbers, case references, or scanned medical files.',
        'Calculated confidence score between 90 and 100.',
      ],
    },
    {
      status: 'Verified' as const,
      minScore: 70,
      badgeText: 'Verified',
      colorClass: 'bg-forestLight text-forestPrimary border-[#78A083]/40',
      description: 'At least one institutional source and corroborating witness/media reports.',
      requirements: [
        'At least 1 verified institutional record (e.g. Shelter intake log, municipal license docket).',
        'Corroborating on-the-record eyewitness statement or verified news investigation.',
        'Calculated confidence score between 70 and 89 (or >=60 with 2+ sources including 1 institutional).',
      ],
    },
    {
      status: 'Partially Verified' as const,
      minScore: 40,
      badgeText: 'Partially Verified',
      colorClass: 'bg-[#FEF7EC] text-[#8A5200] border-[#C97A1E]/30',
      description: 'Single shelter or community source under active editorial review.',
      requirements: [
        'Single verified rescue/shelter source, or 2+ community witness submissions.',
        'No institutional documentation attached yet; ongoing editorial review.',
        'Calculated confidence score between 40 and 69.',
      ],
    },
    {
      status: 'Unverified' as const,
      minScore: 0,
      badgeText: 'Unverified',
      colorClass: 'bg-cardMuted text-inkMuted border-borderLight',
      description: 'Community submission undergoing initial editorial intake and fact-checking.',
      requirements: [
        'Community contributor intake undergoing initial review.',
        'Zero verified source attributions attached.',
        'Calculated confidence score between 0 and 39.',
      ],
    },
  ];

  const sourceWeights = [
    {
      type: 'Police & SAR Dispatch Logs',
      category: 'Police / Law Enforcement',
      baseWeight: '35 – 40 pts',
      institutional: 'Yes (Institutional Authority)',
      notes: 'Official sheriff department incident logs, search and rescue GPS telemetry, or sworn dispatch records.',
      icon: Shield,
    },
    {
      type: 'Court & Judicial Records',
      category: 'Court / Legal Docket',
      baseWeight: '35 – 40 pts',
      institutional: 'Yes (Institutional Authority)',
      notes: 'Certified municipal court records, ownership custody restoration orders, or sworn legal affidavits.',
      icon: FileText,
    },
    {
      type: 'Veterinary Case Files',
      category: 'Veterinary Hospital / Clinic',
      baseWeight: '30 – 35 pts',
      institutional: 'Yes (Institutional Authority)',
      notes: 'Licensed DVM clinical intake logs, surgical charts, radiograph records, and microchip scan telemetry.',
      icon: Building2,
    },
    {
      type: 'Shelter & Rescue Records',
      category: 'Animal Shelter / Humane Society',
      baseWeight: '25 – 35 pts',
      institutional: 'Yes (Institutional Authority)',
      notes: '501(c)(3) rescue intake documentation, microchip registration transfers, and municipal intake logs.',
      icon: Building2,
    },
    {
      type: 'Journalistic News Reports',
      category: 'News Outlet',
      baseWeight: '20 – 25 pts',
      institutional: 'No (Journalistic Secondary)',
      notes: 'Independent news reporting with named author attribution and verified editorial oversight.',
      icon: FileText,
    },
    {
      type: 'Direct Eyewitness Interviews',
      category: 'Eyewitness Account',
      baseWeight: '15 pts',
      institutional: 'No (Community Corroboration)',
      notes: 'Firsthand sworn testimony, recorded audio interviews, or corroborated bystander statements.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="py-8 sm:py-12">
      <Container size="reading">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Fact-Checking Policy' }]} className="mb-6" />

        {/* Page Header */}
        <header className="space-y-4 pb-8 border-b border-borderLight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Editorial Integrity System</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            How Eternal Paws Fact-Checks Dog Stories
          </h1>
          <p className="text-lg sm:text-xl text-inkMuted leading-relaxed">
            Eternal Paws operates a deterministic 4-tier verification calculus engine. We evaluate every canine story against primary records to calculate an objective, mathematical confidence score.
          </p>
        </header>

        {/* The 4 Verification Tiers */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            The 4 Verification Tiers Explained
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Every published narrative is assigned one of four distinct verification tiers based on source density, documentary authority, and independent corroboration:
          </p>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.status}
                className="p-5 rounded-xl bg-card border border-borderLight space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <VerificationBadge status={tier.status} size="md" />
                    <span className="font-mono text-xs text-inkSubtle font-semibold">
                      Min Score: {tier.minScore} pts
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-inkPrimary">
                  {tier.description}
                </p>

                <ul className="space-y-1.5 text-xs text-inkMuted">
                  {tier.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-forestPrimary font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Source Weighting Rubric Table */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Source Weighting Rubric Matrix
          </h2>
          <p className="text-inkMuted leading-relaxed">
            Our scoring algorithm weights evidence by reliability and institutional accountability. Scores are calculated additively and capped at 100 points:
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-borderLight bg-cardMuted/60 text-inkPrimary font-semibold">
                  <th className="p-3">Source Classification</th>
                  <th className="p-3">Base Score</th>
                  <th className="p-3">Authority Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {sourceWeights.map((sw, idx) => {
                  const Icon = sw.icon;
                  return (
                    <tr key={idx} className="hover:bg-cardMuted/30 transition-colors">
                      <td className="p-3 font-medium text-inkPrimary">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-forestPrimary flex-shrink-0" aria-hidden="true" />
                          <div>
                            <span className="font-semibold block">{sw.type}</span>
                            <span className="text-[11px] text-inkMuted">{sw.notes}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-forestPrimary whitespace-nowrap">
                        {sw.baseWeight}
                      </td>
                      <td className="p-3 text-inkMuted whitespace-nowrap">
                        {sw.institutional}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Additive Evidentiary Boosts */}
          <div className="p-4 rounded-lg bg-forestLight/40 border border-forestPrimary/20 space-y-2 text-xs sm:text-sm">
            <h3 className="font-bold text-forestPrimary">
              Additive Evidentiary Boosts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-inkPrimary">
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-forestPrimary">+10 pts</span>
                <span>
                  <strong>Document Reference ID:</strong> Official tracking number, medical dossier code, or police incident number.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-forestPrimary">+5 pts</span>
                <span>
                  <strong>Verifiable Web Link:</strong> Publicly accessible HTTP/HTTPS URL directly connecting to the source archive.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Step Verification Workflow Pipeline */}
        <section className="py-8 space-y-6 border-b border-borderLight">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Our 4-Step Fact-Checking Workflow
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-borderLight flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-forestLight text-forestPrimary font-bold text-sm flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h4 className="font-semibold text-inkPrimary text-sm">Intake & Metadata Extraction</h4>
                <p className="text-xs text-inkMuted">
                  Initial submission review, dog details validation, location verification, and timeline recording.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-borderLight flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-forestLight text-forestPrimary font-bold text-sm flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h4 className="font-semibold text-inkPrimary text-sm">Primary Record Corroboration</h4>
                <p className="text-xs text-inkMuted">
                  Direct outreach to shelters, veterinary clinics, or law enforcement dispatch offices to inspect records.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-borderLight flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-forestLight text-forestPrimary font-bold text-sm flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h4 className="font-semibold text-inkPrimary text-sm">Calculus & Board Evaluation</h4>
                <p className="text-xs text-inkMuted">
                  Deterministic algorithm computes confidence score; Senior Fact-Checker inspects edge cases and AI media.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-borderLight flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-forestLight text-forestPrimary font-bold text-sm flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h4 className="font-semibold text-inkPrimary text-sm">Trust Card & Article Publication</h4>
                <p className="text-xs text-inkMuted">
                  Story published alongside full interactive Trust Card, source citations, and direct reader correction link.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Corrections & Contact */}
        <section className="py-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-inkPrimary">
            Notice a Factual Discrepancy?
          </h3>
          <p className="text-sm text-inkMuted max-w-md mx-auto">
            Our editorial trust desk welcomes reader tips, document additions, and factual corrections.
          </p>
          <div className="pt-2">
            <Link
              href="/corrections"
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-forestPrimary hover:bg-forestPrimary/90 text-white font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary inline-flex items-center justify-center"
            >
              Go to Corrections Desk
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
