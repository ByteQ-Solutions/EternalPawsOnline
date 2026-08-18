# Scope: Milestone M1 — Project Setup, Soft-Shadow Design System & Mobile UX

## Scope & Deliverables
- **Features**: F01, F02, F03, F04, F05
- **Deliverables**:
  1. Project Scaffolding: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `vitest.config.ts`, `postcss.config.js`.
  2. Soft-Shadow Editorial UI Tokens: `src/design-system/tokens.ts`, `app/globals.css` (warm off-white `#FAF8F5`, editorial serif & sans typography, soft shadows, WCAG 2.2 AA contrast >=4.5:1).
  3. Base UI Primitives: `Button`, `Badge`, `Card`, `Modal`, `Input`, `Textarea`, `Accordion`, `Skeleton`, `Container` in `src/design-system/components/`.
  4. 44x44px Touch Targets: Ensure all interactive primitives enforce min 44x44px hit boxes.
  5. Zero-CLS Responsive Layout Primitives: `Header`, `MobileNav`, `Footer`, `Breadcrumbs`, skip-to-content link in `components/layout/`.
  6. Unit & Component Tests for Design Tokens, WCAG AA contrast, and Layout Primitives.

## Exclusive Write Ownership
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`
- `app/globals.css`, `app/layout.tsx`
- `src/design-system/**`
- `components/layout/**`
- `components/ui/**`
- `tests/unit/design-system.test.ts`, `tests/components/layout.test.ts`
