# Technical Specification: Soft-Shadow Editorial UI Tokens & Primitives (F02, F03, F04)

**Author**: Explorer 2 (Milestone M1: Design System & Mobile UX)  
**Target Subsystem**: `src/design-system/`, `app/globals.css`, `tailwind.config.ts`  
**Date**: 2026-08-18  
**Status**: Ready for Implementation  

---

## 1. Executive Summary & Scope

Milestone M1 establishes the foundation of the Eternal Paws platform. The visual and interactive identity is centered on a **Soft-Shadow Editorial UI** that combines the warmth and gravitas of traditional print journalism with the responsiveness, accessibility, and fluidity of a modern digital web platform.

This specification details:
1. **Design Tokens (`src/design-system/tokens.ts`)**: Pure TypeScript token dictionary defining colors, editorial typography, soft elevation shadows, and touch target minimums.
2. **Global CSS & Accessibility Resets (`app/globals.css`)**: Custom properties, base resets, high-visibility `:focus-visible` outlines, safe-area insets, and `prefers-reduced-motion` compliance.
3. **8 Base UI Primitives (`src/design-system/components/`)**:
   - `Button`: Primary, secondary, outline, ghost, gold variants with strict >=44x44px touch targets.
   - `Badge`: Categorical and verification status indicators with high contrast.
   - `Card`: Soft-Shadow elevated surfaces with composite sub-components.
   - `Modal`: WAI-ARIA compliant dialog with focus trap, ESC dismissal, and backdrop blur.
   - `Input` & `Textarea`: Accessible form controls with explicit label association and error states.
   - `Accordion`: Keyboard-navigable collapsible disclosure components.
   - `Skeleton`: Zero-CLS animated layout placeholders.
   - `Container`: Responsive max-width wrappers (mobile 320px to desktop 1280px+).
4. **WCAG 2.2 AA Mathematical Contrast Proofs**: Verifying all text meets >= 4.5:1 (normal text) and >= 3:1 (large text / UI components).

---

## 2. Design Tokens Specification (`src/design-system/tokens.ts`)

### 2.1 Complete Token Schema

```typescript
/**
 * Eternal Paws - Soft-Shadow Editorial UI Design System Tokens
 * Compliant with WCAG 2.2 AA standards and PROJECT.md contract
 */

export const editorialTokens = {
  colors: {
    // Canvas & Surfaces
    canvas: '#FAF8F5',       // Warm off-white page background
    card: '#FFFFFF',         // Crisp editorial card surface
    cardMuted: '#F4F0EA',    // Secondary card & section background
    
    // Typography & Ink
    inkPrimary: '#1E1E1E',   // Primary text (>15:1 contrast against canvas/card)
    inkMuted: '#555555',     // Secondary/meta text (>6.5:1 contrast)
    inkSubtle: '#767676',    // Micro text & borders (>4.5:1 contrast against white)
    
    // Brand & Editorial Accents
    forestPrimary: '#234E35',// Deep editorial forest green (primary CTA & brand)
    forestLight: '#EBF3ED',  // Soft forest tint for badges & secondary CTAs
    forestHover: '#1B3D2A',  // Darkened forest green for hover/active states
    
    // Trust & Attention Accents
    goldAccent: '#C97A1E',   // Warm trust gold / verification indicator
    goldLight: '#FEF7EC',    // Soft gold tint for badges & trust cards
    goldDark: '#8A5200',     // High-contrast gold for text on light backgrounds
    
    // Borders & Dividers
    borderLight: '#E8E3DA',  // Subtle structural divider border
    borderFocus: '#234E35',  // Focus ring outline color
    
    // State Feedback
    error: '#B91C1C',        // WCAG AA compliant error red (>4.5:1 on light)
    errorLight: '#FEF2F2',   // Error container background
    success: '#15803D',      // Success green (>4.5:1 on light)
    successLight: '#F0FDF4', // Success container background
    warning: '#B45309',      // Warning amber
    warningLight: '#FFFBEB', // Warning background
  },

  typography: {
    fontSerif: 'var(--font-editorial-serif), "Newsreader", "Playfair Display", Georgia, serif',
    fontSans: 'var(--font-editorial-sans), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    // Type Scale (Rem based on 16px root)
    sizes: {
      display: { fontSize: '2.5rem', lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' },     // 40px
      h1: { fontSize: '2.0rem', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },           // 32px
      h2: { fontSize: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' },         // 24px
      h3: { fontSize: '1.25rem', lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' },          // 20px
      h4: { fontSize: '1.125rem', lineHeight: '1.35', letterSpacing: '0', fontWeight: '600' },               // 18px
      bodyLarge: { fontSize: '1.125rem', lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' },        // 18px
      body: { fontSize: '1.0rem', lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' },               // 16px
      bodySmall: { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },          // 14px
      caption: { fontSize: '0.75rem', lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' },      // 12px
    }
  },

  spacing: {
    touchTargetMin: '44px', // WCAG 2.2 Success Criterion 2.5.8 & 2.5.5
    safeAreaBuffer: '48px', // Ad and CTA buffer distance
  },

  shadows: {
    soft: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
    elevated: '0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)',
    focusRing: '0 0 0 2px #FAF8F5, 0 0 0 4px #234E35',
  },

  radii: {
    sm: '0.25rem',   // 4px - Micro badges
    md: '0.375rem',  // 6px - Buttons, Inputs
    lg: '0.5rem',    // 8px - Cards
    xl: '0.75rem',   // 12px - Modals, Hero containers
    full: '9999px',  // Pills, avatars
  },

  transitions: {
    default: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;

export type EditorialTokens = typeof editorialTokens;
```

---

## 3. WCAG 2.2 AA Contrast Compliance Validation Matrix

Under WCAG 2.2 AA:
- **Normal text (< 18pt / < 24px, or < 14pt bold / < 18.66px bold)** requires a contrast ratio of at least **4.5:1**.
- **Large text (>= 18pt or >= 14pt bold)** requires at least **3.0:1**.
- **Non-text UI components and graphical objects** (interactive boundaries, focus rings, status indicators) require at least **3.0:1**.

### 3.1 Relative Luminance Calculations

$$L = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$

| Token Name | Hex Code | sRGB (R, G, B) | Linearized (R, G, B) | Relative Luminance ($L$) |
|---|---|---|---|---|
| `card` (White) | `#FFFFFF` | (255, 255, 255) | (1.0000, 1.0000, 1.0000) | **1.0000** |
| `canvas` | `#FAF8F5` | (250, 248, 245) | (0.9560, 0.9388, 0.9132) | **0.9406** |
| `cardMuted` | `#F4F0EA` | (244, 240, 234) | (0.9048, 0.8716, 0.8233) | **0.8752** |
| `forestLight` | `#EBF3ED` | (235, 243, 237) | (0.8315, 0.8966, 0.8477) | **0.8792** |
| `goldLight` | `#FEF7EC` | (254, 247, 236) | (0.9912, 0.9300, 0.8398) | **0.9332** |
| `borderLight` | `#E8E3DA` | (232, 227, 218) | (0.7967, 0.7583, 0.6908) | **0.7616** |
| `goldAccent` | `#C97A1E` | (201, 122, 30) | (0.5841, 0.1947, 0.0130) | **0.2644** |
| `goldDark` | `#8A5200` | (138, 82, 0) | (0.2520, 0.0827, 0.0000) | **0.1128** |
| `inkSubtle` | `#767676` | (118, 118, 118) | (0.1802, 0.1802, 0.1802) | **0.1802** |
| `inkMuted` | `#555555` | (85, 85, 85) | (0.0906, 0.0906, 0.0906) | **0.0906** |
| `forestPrimary` | `#234E35` | (35, 78, 53) | (0.0177, 0.0754, 0.0357) | **0.0603** |
| `inkPrimary` | `#1E1E1E` | (30, 30, 30) | (0.0130, 0.0130, 0.0130) | **0.0130** |

### 3.2 Contrast Ratio Matrix & Evaluation

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 \ge L_2)$$

| Foreground Element | Background Surface | Contrast Ratio | WCAG 2.2 AA Standard | Compliance Verdict | Usage Guidelines |
|---|---|---|---|---|---|
| `inkPrimary` (`#1E1E1E`) | `card` (`#FFFFFF`) | **16.67 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Primary editorial text, headings, body paragraphs on white cards |
| `inkPrimary` (`#1E1E1E`) | `canvas` (`#FAF8F5`) | **15.72 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Primary body text on page canvas |
| `inkPrimary` (`#1E1E1E`) | `cardMuted` (`#F4F0EA`) | **14.69 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Text inside secondary containers |
| `inkMuted` (`#555555`) | `card` (`#FFFFFF`) | **7.47 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Secondary text, timestamps, author credits |
| `inkMuted` (`#555555`) | `canvas` (`#FAF8F5`) | **7.05 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Secondary text on canvas |
| `inkMuted` (`#555555`) | `cardMuted` (`#F4F0EA`) | **6.58 : 1** | >= 4.5:1 (Normal) | **PASS (AA)** | Meta text in cards |
| `inkSubtle` (`#767676`) | `card` (`#FFFFFF`) | **4.56 : 1** | >= 4.5:1 (Normal) | **PASS (AA)** | Micro copy, input placeholders, image captions on white |
| `inkSubtle` (`#767676`) | `canvas` (`#FAF8F5`) | **4.30 : 1** | >= 3.0:1 (Large/UI) | **PASS (Large/UI)** | Use for >=18pt text, borders, or darken to `#707070` (4.54:1) for body text |
| `forestPrimary` (`#234E35`) | `card` (`#FFFFFF`) | **9.52 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Brand headings, link text on white |
| `forestPrimary` (`#234E35`) | `forestLight` (`#EBF3ED`) | **8.42 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Forest badge text on forest background |
| White (`#FFFFFF`) | `forestPrimary` (`#234E35`) | **9.52 : 1** | >= 4.5:1 (Normal) / >= 7:1 (AAA) | **PASS (AAA)** | Primary Button text on forest background |
| `goldDark` (`#8A5200`) | `goldLight` (`#FEF7EC`) | **6.04 : 1** | >= 4.5:1 (Normal) | **PASS (AA)** | Trust badge text on gold light surface |
| `goldDark` (`#8A5200`) | `card` (`#FFFFFF`) | **6.45 : 1** | >= 4.5:1 (Normal) | **PASS (AA)** | Gold accent text on white |
| White (`#FFFFFF`) | `goldAccent` (`#C97A1E`) | **3.34 : 1** | >= 3.0:1 (Large / UI) | **PASS (Large/UI)** | Gold button text (large font, bold >=14pt). For small text, use `inkPrimary` on gold |
| `forestPrimary` (`#234E35`) | `canvas` (`#FAF8F5`) | **8.98 : 1** | >= 3.0:1 (UI Focus) | **PASS (AAA)** | Focus ring outline against background canvas |

---

## 4. CSS Architecture & Accessibility Resets (`app/globals.css`)

### 4.1 Global Stylesheet Specification

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Color Tokens */
    --color-canvas: #FAF8F5;
    --color-card: #FFFFFF;
    --color-card-muted: #F4F0EA;
    --color-ink-primary: #1E1E1E;
    --color-ink-muted: #555555;
    --color-ink-subtle: #767676;
    --color-forest-primary: #234E35;
    --color-forest-light: #EBF3ED;
    --color-forest-hover: #1B3D2A;
    --color-gold-accent: #C97A1E;
    --color-gold-light: #FEF7EC;
    --color-gold-dark: #8A5200;
    --color-border-light: #E8E3DA;
    --color-error: #B91C1C;
    --color-error-light: #FEF2F2;
    --color-success: #15803D;
    --color-success-light: #F0FDF4;

    /* Elevation Shadows */
    --shadow-soft: 0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04);
    --shadow-elevated: 0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04);

    /* Typography */
    --font-editorial-serif: "Newsreader", "Playfair Display", Georgia, serif;
    --font-editorial-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

    /* Mobile Touch Minimum */
    --touch-target-min: 44px;
  }

  /* HTML Root & Canvas Base */
  html {
    background-color: var(--color-canvas);
    color: var(--color-ink-primary);
    font-family: var(--font-editorial-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    min-height: 100vh;
    background-color: var(--color-canvas);
    color: var(--color-ink-primary);
    margin: 0;
    padding: 0;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Editorial Serif Headings */
  h1, h2, h3, .font-serif {
    font-family: var(--font-editorial-serif);
    color: var(--color-ink-primary);
    letter-spacing: -0.015em;
  }

  /* High-Visibility Focus Outlines (WCAG 2.2 AA Criterion 2.4.11 & 2.4.13) */
  :focus-visible {
    outline: 2px solid var(--color-forest-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Accessible Skip-to-Content Link */
  .skip-to-content {
    position: absolute;
    top: -100px;
    left: 1rem;
    z-index: 9999;
    padding: 0.75rem 1.25rem;
    background-color: var(--color-forest-primary);
    color: #FFFFFF;
    font-weight: 600;
    border-radius: 0.375rem;
    text-decoration: none;
    box-shadow: var(--shadow-elevated);
    transition: top 0.2s ease-in-out;
  }

  .skip-to-content:focus {
    top: 1rem;
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
  }

  /* Zero-CLS Media Defaults */
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Touch Target Constraint */
  button, a, input, select, textarea, [role="button"] {
    touch-action: manipulation;
  }
}

/* Reduced Motion Support (WCAG 2.2 AA Criterion 2.2.2 & 2.3.3) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Mobile Safe-Area Inset Support */
@supports (padding: max(0px)) {
  .safe-area-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
  .safe-area-top {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}
```

---

## 5. Base UI Primitives Specification (`src/design-system/components/`)

All base UI primitives reside in `src/design-system/components/` and are re-exported via `src/design-system/index.ts`.

### 5.1 `Button` Component (`src/design-system/components/Button.tsx`)

**Requirements**:
- Minimum 44x44px touch target across all screen sizes.
- Variants: `primary`, `secondary`, `outline`, `ghost`, `gold`.
- States: default, hover, active, focus-visible, disabled, loading (`isLoading` with `aria-busy="true"` and spinner).
- Polymorphic support: renders as `<button>` or Next.js `<Link>`/`<a>` when `asChild` or `href` is provided.

```typescript
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  href?: string;
}
```

**Variant Styling Matrix**:
- `primary`: `bg-forestPrimary text-white hover:bg-forestHover active:scale-[0.98] shadow-soft`
- `secondary`: `bg-forestLight text-forestPrimary hover:bg-forestLight/80 active:scale-[0.98]`
- `outline`: `border border-borderLight bg-card text-inkPrimary hover:bg-cardMuted hover:border-inkMuted/30`
- `ghost`: `text-inkPrimary hover:bg-cardMuted active:bg-cardMuted/80`
- `gold`: `bg-goldAccent text-white hover:bg-[#B56A15] active:scale-[0.98] shadow-soft`

**Touch Target Sizing**:
- `sm`: `min-h-[44px] min-w-[44px] px-3 py-2 text-sm font-medium rounded-md`
- `md`: `min-h-[44px] min-w-[44px] px-4 py-2.5 text-base font-medium rounded-md`
- `lg`: `min-h-[48px] min-w-[48px] px-6 py-3 text-lg font-semibold rounded-lg`
- `icon`: `min-h-[44px] min-w-[44px] p-2.5 flex items-center justify-center rounded-md`

---

### 5.2 `Badge` Component (`src/design-system/components/Badge.tsx`)

**Requirements**:
- High-contrast visual pills for categories, emotional themes, and verification tiers.
- Variants: `default`, `forest`, `gold`, `outline`, `verified`, `partiallyVerified`, `unverified`, `aiDisclosure`.
- Optional leading dot or icon for status indications.

```typescript
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'forest' | 'gold' | 'outline' | 'verified' | 'partiallyVerified' | 'unverified' | 'aiDisclosure';
  size?: 'sm' | 'md';
  dot?: boolean;
}
```

**Variant Styling**:
- `default`: `bg-cardMuted text-inkPrimary border border-borderLight`
- `forest`: `bg-forestLight text-forestPrimary border border-forestPrimary/20 font-medium`
- `gold`: `bg-goldLight text-goldDark border border-goldAccent/30 font-medium`
- `outline`: `border border-borderLight text-inkMuted bg-transparent`
- `verified`: `bg-[#EBF3ED] text-[#1B3D2A] border border-[#234E35]/30 font-semibold`
- `partiallyVerified`: `bg-[#FEF7EC] text-[#8A5200] border border-[#C97A1E]/30 font-semibold`
- `unverified`: `bg-[#F4F0EA] text-[#555555] border border-[#E8E3DA] font-semibold`
- `aiDisclosure`: `bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-mono text-xs`

---

### 5.3 `Card` Component (`src/design-system/components/Card.tsx`)

**Requirements**:
- Soft-Shadow elevation tokens (`shadow-soft` vs `shadow-elevated`).
- Compound subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- Semantic HTML tags: `as="article" | "section" | "div"`.

```typescript
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'outline' | 'elevated';
  as?: 'div' | 'article' | 'section';
}

export function Card({ variant = 'default', as: Component = 'div', className, ...props }: CardProps);
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
export function CardTitle({ as: Component = 'h3', className, ...props }: { as?: 'h2' | 'h3' | 'h4'; className?: string; children: React.ReactNode });
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>);
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>);
```

**Styling & Elevation**:
- `default`: `bg-card border border-borderLight shadow-soft rounded-lg overflow-hidden`
- `muted`: `bg-cardMuted border border-borderLight shadow-none rounded-lg overflow-hidden`
- `elevated`: `bg-card border border-borderLight shadow-elevated rounded-xl overflow-hidden hover:shadow-elevated transition-shadow`
- `outline`: `bg-transparent border border-borderLight rounded-lg`

---

### 5.4 `Modal` (Dialog) Component (`src/design-system/components/Modal.tsx`)

**Requirements**:
- WAI-ARIA Dialog Modal pattern (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
- Focus management: Trap focus inside modal using keyboard tab looping, autofocus on first element, restore focus on close.
- Keyboard support: `Escape` closes modal.
- Backdrop click dismisses modal.
- Body scroll locking (`document.body.style.overflow = 'hidden'`) while open.
- Close button with minimum 44x44px touch hit area.

```typescript
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

---

### 5.5 `Input` & `Textarea` Components (`src/design-system/components/Input.tsx`, `Textarea.tsx`)

**Requirements**:
- Minimum 44px height for `Input` (`min-h-[44px]`).
- Accessible integration: `id`, `htmlFor` label linkage, `aria-invalid`, `aria-errormessage`, `aria-describedby`.
- Error and helper text rendering with appropriate ARIA links.
- High-contrast placeholder (`placeholder:text-inkSubtle`).

```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}
```

---

### 5.6 `Accordion` Component (`src/design-system/components/Accordion.tsx`)

**Requirements**:
- Collapsible disclosures (for FAQs, Verification Source lists, Editorial Policy points).
- WAI-ARIA Accordion Pattern:
  * Trigger: `<button aria-expanded="true|false" aria-controls="region-id" id="button-id">` inside `<h3|h4>`.
  * Panel: `<div role="region" id="region-id" aria-labelledby="button-id">`.
  * Keyboard navigation: `ArrowDown`, `ArrowUp`, `Home`, `End` focus cycling.
- Touch target: Header accordion button min 44px height.

```typescript
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}
```

---

### 5.7 `Skeleton` Component (`src/design-system/components/Skeleton.tsx`)

**Requirements**:
- Animated loading placeholder preventing Cumulative Layout Shift (CLS = 0).
- Props for explicit width, height, aspect ratio (`aspect-video`, `aspect-[4/3]`, `aspect-[16/9]`), and shape (circle, rectangle).
- Accessibility: `aria-hidden="true"`.

```typescript
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
}
```

---

### 5.8 `Container` Component (`src/design-system/components/Container.tsx`)

**Requirements**:
- Zero horizontal overflow guarantee on viewports from 320px to 430px up to 1440px+.
- Width presets:
  * `reading`: `max-w-3xl` (~768px) for comfortable editorial line lengths (60-75 characters per line).
  * `default`: `max-w-6xl` (~1152px) for grids and standard page sections.
  * `wide`: `max-w-7xl` (~1280px) for headers, hero banners, and expansive feeds.
- Padding: `px-4 sm:px-6 lg:px-8`.

```typescript
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'reading' | 'default' | 'wide' | 'full';
  as?: 'div' | 'section' | 'article' | 'main';
}
```

---

## 6. Zero-CLS & Mobile-First UX Integration

### 6.1 Layout Stability Formula
1. **Aspect Ratio Pre-allocation**: Images and video containers use explicit `aspect-ratio` or Tailwind aspect classes (`aspect-[16/9]`, `aspect-[4/3]`) with `Skeleton` fallbacks.
2. **Ad Slot Reservations**: Monetization bounding boxes (`min-height: 250px`, `min-height: 90px`) allocate space prior to client script evaluation.
3. **Font Font-Display Swap**: Local fallback serif and sans fonts with size-adjust to prevent text reflow during font loading.

### 6.2 Mobile Touch Target & Spacing Standards
- All clickable elements (`<button>`, `<a>`, `<input>`, `<select>`, `<summary>`) must have an active hit bounding box of at least **44 × 44 CSS pixels**.
- Adjacent touch targets must maintain at least **8px of separation** to prevent accidental mis-taps.

---

## 7. Verification Strategy & Test Plan

### 7.1 Unit & Contract Tests (`tests/unit/design-system.test.ts`)
- **Token Contract Verification**: Verify all color hexes, typography variables, shadows, and touch constants exist and match `PROJECT.md`.
- **Contrast Matrix Test**: Programmatically calculate WCAG 2.2 relative luminance and verify every token combination meets >=4.5:1 (normal) or >=3.0:1 (large/UI).
- **Component Touch Target Tests**: Mount `Button`, `Badge`, `Input`, `Accordion`, verify DOM bounding box / CSS classes enforce `min-height: 44px`.
- **ARIA Attribute Tests**:
  * `Modal`: verifies `role="dialog"`, `aria-modal="true"`, focus trap on Tab, ESC listener.
  * `Accordion`: verifies `aria-expanded`, `aria-controls`, `role="region"`.
  * `Input`: verifies `aria-invalid`, `aria-describedby` when errors are provided.

---

## 8. Summary of Deliverables for Worker Implementation

| Component / File | Key Requirements to Implement |
|---|---|
| `src/design-system/tokens.ts` | Complete `editorialTokens` object with colors, fonts, touch minimums, shadows, radii |
| `src/design-system/index.ts` | Central re-export of tokens and all 8 UI primitives |
| `app/globals.css` | CSS variables, typography classes, high-visibility focus ring, accessibility resets, reduced motion |
| `src/design-system/components/Button.tsx` | 5 variants, 4 sizes, min 44x44px touch targets, loading spinner, focus ring |
| `src/design-system/components/Badge.tsx` | Verification badges, category pills, trust indicators, high contrast |
| `src/design-system/components/Card.tsx` | Soft-shadow elevated surfaces, compound subcomponents |
| `src/design-system/components/Modal.tsx` | Accessible dialog, focus trap, ESC listener, backdrop, body lock |
| `src/design-system/components/Input.tsx` | Min 44px height, label linkage, helper/error text, ARIA attributes |
| `src/design-system/components/Textarea.tsx` | Accessible textarea, label, error state, ARIA linkage |
| `src/design-system/components/Accordion.tsx` | Accessible collapsible items, keyboard arrows navigation, ARIA regions |
| `src/design-system/components/Skeleton.tsx` | Animated CLS-prevention placeholders with aspect ratios |
| `src/design-system/components/Container.tsx` | Responsive max-width wrappers with mobile padding |
