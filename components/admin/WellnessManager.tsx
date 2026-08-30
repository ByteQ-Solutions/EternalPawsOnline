'use client';

import React, { useState } from 'react';
import { allWellnessGuides, WellnessGuide, WellnessCategory, UrgencyLevel } from '@/lib/data/wellness';
import { Search, Plus, Edit3, ShieldCheck, AlertTriangle, HeartPulse, ExternalLink, Check, Brain, Bone, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export const WellnessManager: React.FC = () => {
  const [guides, setGuides] = useState<WellnessGuide[]>(allWellnessGuides);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<WellnessGuide | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<WellnessGuide>>({});

  const filteredGuides = guides.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (guide: WellnessGuide) => {
    setSelectedGuide(guide);
    setEditForm({ ...guide });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide || !editForm.slug) return;

    setGuides((prev) =>
      prev.map((g) => (g.slug === selectedGuide.slug ? ({ ...g, ...editForm } as WellnessGuide) : g))
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setIsEditing(false);
      setSaveSuccess(false);
    }, 1200);
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'emergency':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 animate-pulse">🚨 EMERGENCY</span>;
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">⚡ HIGH URGENCY</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">⚠️ MODERATE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forestLight text-forestPrimary">ℹ️ INFORMATIONAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-borderLight rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-inkPrimary font-serif">
              Canine Health, Behavior & Wellness Desk
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-inkMuted mt-1">
            Manage clinical veterinary guidance, emergency action protocols, and behavior neuroscience guides.
          </p>
        </div>

        <Link
          href="/wellness"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-xl transition-colors shrink-0"
        >
          <span>View Live Public Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Controls Bar: Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-inkMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wellness guides (e.g. chocolate, heatstroke, leaning, arthritis)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-card border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Guides', value: 'all' },
            { label: '🚨 First Aid', value: 'first-aid' },
            { label: '🧠 Behavior', value: 'behavior' },
            { label: '🦴 Senior Care', value: 'senior-care' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterCategory(f.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === f.value
                  ? 'bg-forestPrimary text-white shadow-xs'
                  : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide) => (
          <div
            key={guide.slug}
            className="bg-card border border-borderLight rounded-2xl p-5 space-y-4 hover:shadow-soft transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                {getUrgencyBadge(guide.urgency)}
                <span className="text-[11px] font-bold text-forestPrimary flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {guide.vetReviewedBy}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-inkPrimary line-clamp-2">
                {guide.title}
              </h3>

              <p className="text-xs text-inkMuted line-clamp-2">
                {guide.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-borderLight/60 flex items-center justify-between">
              <span className="text-[11px] text-inkMuted">
                {guide.readTimeMinutes} min read • {guide.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(guide)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-xl transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Guide
                </button>
                <Link
                  href={`/wellness/${guide.slug}`}
                  target="_blank"
                  className="p-1.5 text-inkMuted hover:text-inkPrimary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkPrimary/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-canvas border border-borderLight rounded-2xl shadow-elevated w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <h3 className="text-lg font-bold text-inkPrimary font-serif flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-forestPrimary" />
                Edit Wellness Guide
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-inkMuted hover:text-inkPrimary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Guide Title</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary font-serif font-bold text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Category</label>
                  <select
                    value={editForm.category || 'first-aid'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as WellnessCategory })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  >
                    <option value="first-aid">🚨 First Aid & Emergency</option>
                    <option value="behavior">🧠 Behavior Decoded</option>
                    <option value="senior-care">🦴 Senior Dog Care</option>
                    <option value="puppy-care">🐾 Puppy Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Urgency Level</label>
                  <select
                    value={editForm.urgency || 'informational'}
                    onChange={(e) => setEditForm({ ...editForm, urgency: e.target.value as UrgencyLevel })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  >
                    <option value="emergency">🚨 Emergency (Immediate Danger)</option>
                    <option value="high">⚡ High Urgency</option>
                    <option value="moderate">⚠️ Moderate (Monitor closely)</option>
                    <option value="informational">ℹ️ Informational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Read Time (Minutes)</label>
                  <input
                    type="number"
                    value={editForm.readTimeMinutes || 4}
                    onChange={(e) => setEditForm({ ...editForm, readTimeMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Vet Reviewer Name</label>
                  <input
                    type="text"
                    value={editForm.vetReviewedBy || ''}
                    onChange={(e) => setEditForm({ ...editForm, vetReviewedBy: e.target.value })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Vet Credentials / Specialty</label>
                  <input
                    type="text"
                    value={editForm.vetCredentials || ''}
                    onChange={(e) => setEditForm({ ...editForm, vetCredentials: e.target.value })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Excerpt / Search Snippet</label>
                <textarea
                  rows={2}
                  value={editForm.excerpt || ''}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Clinical Overview & Pathophysiology</label>
                <textarea
                  rows={4}
                  value={editForm.overview || ''}
                  onChange={(e) => setEditForm({ ...editForm, overview: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  required
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Health & Wellness guide updated successfully!
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-inkMuted hover:bg-cardMuted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-forestPrimary hover:bg-forestHover shadow-soft transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
