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
    inkSubtle: '#767676',    // Micro text & borders (>4.5:1 contrast against white card surface)
    
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
    fontSerif: 'var(--font-editorial-serif), Georgia, serif',
    fontSans: 'var(--font-editorial-sans), system-ui, sans-serif',
    
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

  touchTargetMin: '44px', // PROJECT.md contract & WCAG 2.2 Criterion 2.5.8

  spacing: {
    touchTargetMin: '44px',
    safeAreaBuffer: '48px',
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
