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
        'forest-hover': '#1B3D2A',
        forestHover: '#1B3D2A',
        'gold-accent': '#C97A1E',
        goldAccent: '#C97A1E',
        'gold-light': '#FEF7EC',
        goldLight: '#FEF7EC',
        'gold-dark': '#8A5200',
        goldDark: '#8A5200',
        'border-light': '#E8E3DA',
        borderLight: '#E8E3DA',
        error: {
          DEFAULT: '#B91C1C',
          light: '#FEF2F2',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FFFBEB',
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
