import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedStories } from '@/lib/data/stories';
import { ES_TRANSLATIONS } from '@/lib/i18n/translations';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import { NewsletterBanner } from '@/components/engagement/NewsletterBanner';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Eternal Paws en Español — Historias Reales y Verificadas de Perros',
  description: 'Historias conmovedoras, rescates heroicos y reencuentros milagrosos de perros, verificados con registros oficiales.',
};

export default function SpanishHomePage() {
  const stories = getPublishedStories();

  return (
    <main id="main-content" className="min-h-screen bg-canvas pb-16">
      {/* Hero Section */}
      <section className="pt-8 pb-12 bg-gradient-to-b from-cardMuted/80 to-canvas border-b border-borderLight">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="forest" size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Edición en Español
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-inkPrimary tracking-tight">
              {ES_TRANSLATIONS.tagline}
            </h1>
            <p className="text-base sm:text-lg text-inkMuted leading-relaxed">
              Periodismo digital rigurosamente verificado con refugios, rescates y registros veterinarios.
            </p>
          </div>
        </Container>
      </section>

      {/* Stories Grid */}
      <Container size="default" className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
            Historias Destacadas
          </h2>
          <span className="text-xs font-semibold text-forestPrimary flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Verificadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="flex flex-col h-full bg-card hover:shadow-elevated transition-shadow duration-200 border-borderLight rounded-2xl overflow-hidden group"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-cardMuted">
                <OptimizedDogImage
                  image={story.heroImage}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <CardContent className="flex flex-col flex-grow p-5 sm:p-6 justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-inkSubtle mb-2">
                    <span className="font-semibold text-inkPrimary">
                      {story.dogName} • {story.dogBreed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {story.readTimeMinutes} {ES_TRANSLATIONS.engagement.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug line-clamp-2">
                    <Link href={`/stories/${story.slug}`} className="focus-visible:underline">
                      {story.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-sm text-inkMuted line-clamp-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-borderLight flex items-center justify-between">
                  <VerificationBadge status={story.verification.status} size="sm" showScore={false} />
                  <Link
                    href={`/stories/${story.slug}`}
                    className="min-h-[44px] inline-flex items-center text-xs font-bold text-forestPrimary hover:text-forestHover"
                  >
                    Leer Historia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <NewsletterBanner className="mt-12" />
      </Container>
    </main>
  );
}
