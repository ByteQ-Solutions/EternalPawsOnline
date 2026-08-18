import React from 'react';
import { Metadata } from 'next';
import { StorySubmissionWizard } from '@/components/forms/StorySubmissionWizard';

export const metadata: Metadata = {
  title: 'Submit Your Dog\'s True Story | Eternal Paws',
  description: 'Share your verified dog rescue, reunion, loyalty, or survival story with our fact-checking editorial desk.',
};

export default function SubmitStoryPage() {
  return (
    <main id="main-content" className="min-h-screen bg-canvas">
      <StorySubmissionWizard />
    </main>
  );
}
