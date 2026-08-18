import React from 'react';
import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Editorial CMS & Verification Gate | Eternal Paws',
  description: 'Manage verified dog stories, pre-publish quality checklists, and 301 slug redirect rules.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main id="main-content" className="min-h-screen bg-canvas">
      <AdminDashboard />
    </main>
  );
}
