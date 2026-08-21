import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { DEFAULT_BASE_URL } from '@/lib/seo';
import './globals.css';
import SkipToContent from '@/components/layout/SkipToContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicAnnouncementBanner from '@/components/layout/PublicAnnouncementBanner';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-sans',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

const serifFont = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial-serif',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  fallback: ['Georgia', 'Cambria', 'serif'],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  title: {
    default: 'Eternal Paws — Verified True Dog Stories',
    template: '%s | Eternal Paws',
  },
  description:
    'Rigorously verified, uplifting true stories of heroic dogs, joyful reunions, loyalty, and rescue miracles. Built on trust and 4-tier fact-checking.',
  metadataBase: new URL(DEFAULT_BASE_URL),
  keywords: ['true dog stories', 'dog reunions', 'hero dogs', 'dog rescue', 'verified pet stories'],
  authors: [{ name: 'Eternal Paws Editorial Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eternal-paws.com',
    siteName: 'Eternal Paws',
    title: 'Eternal Paws — Verified True Dog Stories',
    description: 'Verified true stories of loyalty, courage, and rescue miracles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eternal Paws — Verified True Dog Stories',
    description: 'Verified true stories of loyalty, courage, and rescue miracles.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://xiyudmicwbmogliiqdxf.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://xiyudmicwbmogliiqdxf.supabase.co" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-canvas text-inkPrimary font-sans antialiased min-h-screen flex flex-col selection:bg-forestLight selection:text-forestPrimary overflow-x-hidden">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GWT084SEKZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GWT084SEKZ');
          `}
        </Script>

        {/* WCAG 2.4.1 Skip Navigation Link */}
        <SkipToContent targetId="main-content" />

        {/* Global Public Announcement Banner */}
        <PublicAnnouncementBanner />

        {/* Global Sticky Editorial Header */}
        <Header />

        {/* Main Content Landmark */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        {/* Global Editorial Footer */}
        <Footer />
      </body>
    </html>
  );
}
