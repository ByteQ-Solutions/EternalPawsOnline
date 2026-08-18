# Scope: Milestone M2 — Domain Models & Fact-Checking Trust Engine

## Scope & Deliverables
- **Features**: F06, F07, F08, F09, F10, F11
- **Deliverables**:
  1. **Master Domain Schemas & Types**:
     - `src/domain/types.ts`: `Story`, `StoryCategory`, `EmotionalTheme`, `VerificationStatus`, `SourceType`, `SourceAttribution`, `ImageMedia`, `PublicTrustCardData`, `DogDetails`.
     - `src/domain/schemas.ts`: Comprehensive Zod schemas for all domain entities, source validation, and editorial rules.
     - `src/domain/index.ts`: Unified domain exports.
  2. **4-Tier Verification & Trust Calculus**:
     - `src/domain/verification.ts`: Strict deterministic status calculus (`Unverified`, `Partially Verified`, `Verified`, `Strongly Verified`), source weighing, trust score (0-100), and automated downgrading/upgrading rules based on source count and types.
  3. **High-Quality Verified Seed Data**:
     - `src/lib/data/stories.ts`: Rich, verified true emotional dog stories across all 6 categories (`reunions`, `hero-dogs`, `rescues`, `survival`, `loyalty`, `lost-and-found`) with multi-source attribution, realistic veterinary/police/shelter references, AI image disclosures, and reading times.
  4. **Trust & Fact-Checking UI Components**:
     - `components/trust/VerificationBadge.tsx`: Color-coded badges for all 4 verification levels with accessible ARIA labels.
     - `components/trust/TrustCard.tsx`: Public Trust Card displaying verification status, trust score, fact-checker info, source attribution accordion, methodology statement, and correction link.
     - `components/trust/SourceAttributionList.tsx`: Normalized citation list with organization names, URLs, document references, and verification timestamps.
     - `components/trust/ImageDisclosure.tsx`: Mandatory AI visual reconstruction disclosure pill and original photo credits.
     - `components/trust/CorrectionModal.tsx`: Accessible interactive modal for readers to submit factual corrections.
     - `components/trust/index.ts`: Component exports.
  5. **Public Policy & Integrity Pages**:
     - `app/about/page.tsx`: Mission, standards, and dog advocacy statement.
     - `app/editorial-policy/page.tsx`: Editorial integrity, anti-clickbait standards, and correction protocol.
     - `app/fact-checking/page.tsx`: Verification tiers matrix, institutional sourcing requirements, and trust scoring methodology.
     - `app/corrections/page.tsx`: Public transparency log of editorial corrections and intake form.
  6. **Unit & Component Tests**:
     - `tests/unit/domain-schemas.test.ts`, `tests/unit/verification-calculus.test.ts`, `tests/components/trust-components.test.ts` passing 100%.

## Exclusive Write Ownership
- `src/domain/**`
- `src/lib/data/**`
- `components/trust/**`
- `src/features/trust/**`
- `app/about/**`, `app/editorial-policy/**`, `app/fact-checking/**`, `app/corrections/**`
- `tests/unit/domain-schemas.test.ts`, `tests/unit/verification-calculus.test.ts`, `tests/components/trust-components.test.ts`
