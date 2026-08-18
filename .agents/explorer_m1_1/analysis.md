# Technical Strategy & File Specifications: Project Scaffolding (F01)

**Author**: Explorer 1 (`explorer_m1_1`)  
**Milestone**: M1 — Project Setup, Soft-Shadow Design System & Mobile UX  
**Date**: 2026-08-18  
**Target Project Root**: `e:/Claude/EternalPaws/Eternal-Paws`

---

## 1. Workspace State & Environment Assessment

### 1.1 Host Environment
- **Operating System**: Windows 11 (PowerShell environment)
- **Node.js Runtime**: `v24.13.1` (Active LTS / Modern Node)
- **Package Manager**: `npm v11.12.1`
- **Integrity Mode**: Development
- **Existing Repository Files**:
  - `ORIGINAL_REQUEST.md`: Core system requirements (R1-R6) and acceptance criteria
  - `PROJECT.md`: Architecture overview, 29 feature inventory (F01-F29), milestones (M1-M7), code layout
  - `TEST_INFRA.md`: Tier 1-4 test strategy, 303+ test cases specification, test runner semantics
  - `.agents/sub_orch_m1_design/SCOPE.md`: Milestone M1 write boundaries and deliverables

### 1.2 Scaffolding Goals (Feature F01)
Milestone M1 establishes the foundational engineering platform for Eternal Paws. Feature F01 requires a bulletproof, zero-friction setup supporting:
1. **Next.js 14+ App Router** with SSR/SSG article rendering, dynamic routing, metadata generation, and image optimization.
2. **React 18** with strict component lifecycle, server and client components, and accessible hooks.
3. **TypeScript 5.x Strict Mode** with strict null checks, no implicit any, and comprehensive path aliasing.
4. **Tailwind CSS 3.4+** configured with the Soft-Shadow editorial design tokens, custom font variables, WCAG AA color palettes, and responsive breakpoints.
5. **Vitest 2.x + Testing Library** test harness configured for fast unit, component, boundary, pairwise, and integration testing with DOM mocking.
6. **Utility Foundations**: `clsx`, `tailwind-merge`, and `class-variance-authority` (cva) for type-safe, collision-free component variant management.

---

## 2. Dependency Architecture & Compatibility Matrix

### 2.1 Production Dependencies (`dependencies`)

| Package | Version | Rationale & Usage |
|---|---|---|
| `next` | `^14.2.24` | Stable Next.js 14 App Router, dynamic routing (`/stories/:slug`, `/[category]`), built-in image optimization, metadata API, and fast SSR/SSG. |
| `react` | `^18.3.1` | Modern React 18 with complete concurrency and server component primitives. |
| `react-dom` | `^18.3.1` | DOM renderer matching React 18. |
| `clsx` | `^2.1.1` | Ultra-fast conditional class concatenation. |
| `tailwind-merge` | `^2.5.4` | Intelligently merges Tailwind utility classes without specificity conflicts. |
| `class-variance-authority` | `^0.7.0` | Declarative, type-safe component variant creation for design system primitives (`Button`, `Badge`, etc.). |
| `lucide-react` | `^0.453.0` | Comprehensive, accessible SVG icon library for editorial navigation, trust badges, share tools, and CMS controls. |
| `zod` | `^3.23.8` | Schema definition and runtime validation for story models (M2), form submissions (M5), and API payloads. |

### 2.2 Developer & Testing Dependencies (`devDependencies`)

| Package | Version | Rationale & Usage |
|---|---|---|
| `typescript` | `^5.6.3` | Modern TypeScript compiler for end-to-end type safety. |
| `@types/node` | `^20.17.0` | Node.js type definitions compatible with Node 18/20/24. |
| `@types/react` | `^18.3.12` | Type definitions for React 18. |
| `@types/react-dom` | `^18.3.1` | Type definitions for React DOM 18. |
| `tailwindcss` | `^3.4.14` | Utility-first CSS framework with JIT compiler. |
| `postcss` | `^8.4.47` | CSS post-processing engine. |
| `autoprefixer` | `^10.4.20` | Automatic vendor prefixing for cross-browser CSS compatibility. |
| `@tailwindcss/typography` | `^0.5.15` | Tailwind prose plugin for rich editorial article layout formatting. |
| `vitest` | `^2.1.3` | Blazing fast ESM-native test runner for unit and component tests. |
| `@vitejs/plugin-react` | `^4.3.3` | Vite React plugin for JSX/TSX transformation in Vitest. |
| `jsdom` | `^25.0.1` | Headless browser DOM environment for React Testing Library. |
| `@testing-library/react` | `^16.0.1` | Standard React component test utilities. |
| `@testing-library/jest-dom` | `^6.6.2` | Custom Jest/Vitest DOM matchers (`toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`). |
| `@testing-library/user-event` | `^14.5.2` | Realistic browser event simulation for interaction tests. |
| `@testing-library/dom` | `^10.4.0` | Core DOM testing queries. |
| `vite-tsconfig-paths` | `^5.0.1` | Resolves TypeScript path aliases automatically in Vitest. |
| `eslint` | `^8.57.1` | Core JavaScript/TypeScript linter. |
| `eslint-config-next` | `^14.2.24` | Next.js standard lint rules and Core Web Vitals checks. |

---

## 3. Configuration Blueprints (Exact File Specifications)

### 3.1 `package.json`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/package.json`

```json
{
  "name": "eternal-paws",
  "version": "1.0.0",
  "private": true,
  "description": "Production digital media publication platform for verified true emotional dog stories",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:tier1": "vitest run tests/tier1-feature-coverage",
    "test:tier2": "vitest run tests/tier2-boundary-corner",
    "test:tier3": "vitest run tests/tier3-pairwise-combinations",
    "test:tier4": "vitest run tests/tier4-real-world-scenarios"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.453.0",
    "next": "^14.2.24",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.2",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.17.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.24",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite-tsconfig-paths": "^5.0.1",
    "vitest": "^2.1.3"
  }
}
```

---

### 3.2 `tsconfig.json`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/tsconfig.json`

Key architectural decisions for TypeScript:
- `"strict": true`: Guarantees null safety, no implicit any, and strict property initialization.
- `"moduleResolution": "bundler"`: Modern Next.js 14 and Vite resolution strategy.
- Path aliases: Supports both `@/*` general mapping as well as explicit domain namespaces (`@/components/*`, `@/app/*`, `@/lib/*`, `@/domain/*`, `@/features/*`, `@/design-system/*`, `@/tests/*`).

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*", "./*"],
      "@/components/*": ["./components/*", "./src/design-system/components/*", "./src/components/*"],
      "@/app/*": ["./app/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/features/*": ["./src/features/*"],
      "@/design-system/*": ["./src/design-system/*"],
      "@/tests/*": ["./tests/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

---

### 3.3 `tailwind.config.ts`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/tailwind.config.ts`

Full token mapping implementing the Soft-Shadow Editorial UI specified in `PROJECT.md` and `ORIGINAL_REQUEST.md`:
- **Canvas & Surfaces**:
  - `canvas`: `#FAF8F5` (Warm off-white background)
  - `card`: `#FFFFFF` (Crisp editorial card surface)
  - `card-muted` / `cardMuted`: `#F4F0EA` (Secondary card surface)
- **Ink & Typography**:
  - `ink-primary` / `inkPrimary`: `#1E1E1E` (>15:1 contrast against canvas/card)
  - `ink-muted` / `inkMuted`: `#555555` (>6.5:1 contrast)
  - `ink-subtle` / `inkSubtle`: `#767676` (>4.5:1 WCAG AA text contrast)
- **Brand & Trust Accents**:
  - `forest-primary` / `forestPrimary`: `#234E35` (Brand primary dark green)
  - `forest-light` / `forestLight`: `#EBF3ED` (Brand light tint surface)
  - `gold-accent` / `goldAccent`: `#C97A1E` (Trust & verification accent)
  - `gold-light` / `goldLight`: `#FEF7EC` (Trust badge surface)
  - `border-light` / `borderLight`: `#E8E3DA` (Subtle structural border)
- **Soft-Shadow Extensions**:
  - `soft`: `0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)`
  - `elevated`: `0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)`
  - `card`: `0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)`
  - `modal`: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **Typography Font Families**:
  - `serif`: `var(--font-editorial-serif), Georgia, Cambria, 'Times New Roman', serif`
  - `sans`: `var(--font-editorial-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - `mono`: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- **Touch Target Dimensions**:
  - `touch`: `44px` (`min-h-[44px] min-w-[44px]`)

```typescript
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './tests/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F5',
        card: '#FFFFFF',
        'card-muted': '#F4F0EA',
        cardMuted: '#F4F0EA',
        'ink-primary': '#1E1E1E',
        inkPrimary: '#1E1E1E',
        'ink-muted': '#555555',
        inkMuted: '#555555',
        'ink-subtle': '#767676',
        inkSubtle: '#767676',
        'forest-primary': '#234E35',
        forestPrimary: '#234E35',
        'forest-light': '#EBF3ED',
        forestLight: '#EBF3ED',
        'gold-accent': '#C97A1E',
        goldAccent: '#C97A1E',
        'gold-light': '#FEF7EC',
        goldLight: '#FEF7EC',
        'border-light': '#E8E3DA',
        borderLight: '#E8E3DA',
        // Semantic feedback tokens
        error: {
          DEFAULT: '#C53030',
          light: '#FFF5F5',
        },
        success: {
          DEFAULT: '#234E35',
          light: '#EBF3ED',
        },
      },
      fontFamily: {
        serif: ['var(--font-editorial-serif)', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['var(--font-editorial-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
        elevated: '0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)',
        card: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      maxWidth: {
        reading: '680px',
        content: '1200px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
```

---

### 3.4 `postcss.config.js`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 3.5 `vitest.config.ts`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/vitest.config.ts`

Vitest configuration configured with:
- `globals: true` (for `describe`, `it`, `expect`, `beforeEach`, `afterEach`)
- `environment: 'jsdom'` (DOM simulation)
- `setupFiles: ['./tests/setup.ts']` (global DOM matchers and mocks)
- `resolve.alias` mapping `@` and all project subdirectories
- Includes all test tiers (`tests/**/*.test.{ts,tsx}`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/design-system': path.resolve(__dirname, './src/design-system'),
      '@/tests': path.resolve(__dirname, './tests'),
    },
  },
});
```

---

### 3.6 `tests/setup.ts`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/tests/setup.ts`

Provides:
- `@testing-library/jest-dom/vitest` matcher bindings
- Automatic `@testing-library/react` cleanup after each test
- Browser polyfills for `matchMedia`, `IntersectionObserver`, `ResizeObserver`, and `window.scrollTo` to ensure tests running in JSDOM do not throw runtime exceptions.

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically unmount React trees after each test
afterEach(() => {
  cleanup();
});

// Polyfill window.matchMedia for responsive & theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill IntersectionObserver (reading progress & lazy loading)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = () => {};
  observe = () => {};
  takeRecords = (): IntersectionObserverEntry[] => [];
  unobserve = () => {};
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Polyfill ResizeObserver
class MockResizeObserver implements ResizeObserver {
  disconnect = () => {};
  observe = () => {};
  unobserve = () => {};
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Polyfill window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});
```

---

### 3.7 `next.config.mjs`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure strict TypeScript and ESLint checking during production builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
```

---

### 3.8 `.eslintrc.json`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

---

### 3.9 `.gitignore`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/.gitignore`

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts.bak
```

---

### 3.10 `src/lib/utils/cn.ts` and `src/lib/utils.ts`
**Location**: `e:/Claude/EternalPaws/Eternal-Paws/src/lib/utils/cn.ts` and `e:/Claude/EternalPaws/Eternal-Paws/src/lib/utils.ts`

The foundational class merging utility combining `clsx` and `tailwind-merge`. Essential for every UI component.

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## 4. Step-by-Step Implementation Guide for the Worker

When the Worker executes Milestone M1 implementation, it should follow this exact sequence:

1. **Write Configuration Files**:
   - Create `package.json`
   - Create `tsconfig.json`
   - Create `tailwind.config.ts`
   - Create `postcss.config.js`
   - Create `vitest.config.ts`
   - Create `tests/setup.ts`
   - Create `next.config.mjs`
   - Create `.eslintrc.json`
   - Create `.gitignore`
   - Create `src/lib/utils/cn.ts` and `src/lib/utils.ts`

2. **Execute Package Installation**:
   ```powershell
   npm install
   ```
   *Note*: In the Windows PowerShell environment, run `npm install` directly in the project root.

3. **Verify Toolchain & Scripts**:
   - Run `npx vitest run --passWithNoTests` or `npm test` to confirm Vitest boots properly with JSDOM and aliases.
   - Run `npx tsc --noEmit` to verify strict TypeScript compilation.
   - Run `npx next lint` to confirm ESLint configuration.

4. **Directory Structure Verification**:
   Ensure the following directory structure exists:
   ```
   e:/Claude/EternalPaws/Eternal-Paws/
   ├── app/
   │   ├── (public)/
   │   ├── admin/
   │   ├── api/
   │   ├── layout.tsx
   │   ├── globals.css
   │   ├── error.tsx
   │   └── not-found.tsx
   ├── components/
   │   └── layout/
   ├── src/
   │   ├── design-system/
   │   │   ├── components/
   │   │   └── tokens.ts
   │   ├── domain/
   │   ├── features/
   │   └── lib/
   │       └── utils/
   ├── tests/
   │   ├── unit/
   │   ├── integration/
   │   └── harness/
   ```

---

## 5. Compatibility & Risk Mitigation

| Risk | Likelihood | Mitigation Strategy |
|---|---|---|
| **Path Alias Mismatch between Vite and TS** | Low | Explicitly mirror path mappings in `tsconfig.json` (`compilerOptions.paths`) and `vitest.config.ts` (`resolve.alias`), plus include `vite-tsconfig-paths`. |
| **JSDOM Missing Browser APIs in Tests** | Medium | `tests/setup.ts` provides explicit mocks for `matchMedia`, `IntersectionObserver`, `ResizeObserver`, and `scrollTo`. |
| **Tailwind Class Purging in Tests/App** | Low | `tailwind.config.ts` content glob includes `./app/**/*`, `./src/**/*`, `./components/**/*`, and `./tests/**/*`. |
| **Node.js 24 Compatibility** | Low | All selected package versions (`next@^14.2.24`, `vitest@^2.1.3`, `typescript@^5.6.3`) are fully tested and compatible with Node 20 and Node 24. |

---

## 6. Summary for Milestone M1

The scaffolding specified herein gives Milestone M1 and all downstream milestones (M2 through M7) a rock-solid, type-safe, and high-performance foundation. All required scripts (`npm run build`, `npm run test`, `npm run lint`) and path aliases are cleanly integrated.
