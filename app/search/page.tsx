import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchInterface } from '@/components/search/SearchInterface';
import { Container } from '@/design-system/components/Container';
import { Skeleton } from '@/design-system/components/Skeleton';

export const metadata: Metadata = {
  title: 'Search Verified Dog Stories | Eternal Paws',
  description: 'Search documented true stories of dog loyalty, survival, heroic rescues, and miraculous reunions.',
};

export const revalidate = 60;

export default function SearchPage() {
  return (
    <main id="main-content" className="min-h-screen bg-canvas">
      <Suspense
        fallback={
          <Container className="py-12 max-w-5xl">
            <div className="text-center max-w-xl mx-auto space-y-4 mb-8">
              <Skeleton className="h-6 w-32 mx-auto rounded-full" />
              <Skeleton className="h-10 w-3/4 mx-auto rounded-lg" />
              <Skeleton className="h-4 w-full mx-auto" />
            </div>
            <Skeleton className="h-24 w-full rounded-2xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </Container>
        }
      >
        <SearchInterface />
      </Suspense>
    </main>
  );
}

