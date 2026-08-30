'use client';

import React, { useState } from 'react';
import { allFoodSafetyItems, FoodSafetyItem, FoodSafetyStatus, FoodCategory } from '@/lib/data/food-safety';
import { Search, Plus, Edit3, ShieldAlert, ShieldCheck, AlertTriangle, Apple, ExternalLink, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const FoodSafetyManager: React.FC = () => {
  const [items, setItems] = useState<FoodSafetyItem[]>(allFoodSafetyItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<FoodSafetyItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [editForm, setEditForm] = useState<Partial<FoodSafetyItem>>({});

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (item: FoodSafetyItem) => {
    setSelectedItem(item);
    setEditForm({ ...item });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !editForm.slug) return;

    setItems((prev) =>
      prev.map((it) => (it.slug === selectedItem.slug ? ({ ...it, ...editForm } as FoodSafetyItem) : it))
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setIsEditing(false);
      setSaveSuccess(false);
    }, 1200);
  };

  const getStatusBadge = (status: FoodSafetyStatus) => {
    switch (status) {
      case 'safe':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">✅ SAFE</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">⚠️ MODERATE RISK</span>;
      case 'toxic':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 animate-pulse">🚫 TOXIC</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-borderLight rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍏</span>
            <h2 className="text-xl font-bold text-inkPrimary font-serif">
              Canine Food Safety & Nutrition Desk
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-inkMuted mt-1">
            Manage {items.length} veterinary-reviewed food safety items, toxicity levels, and serving guidelines.
          </p>
        </div>

        <Link
          href="/can-dogs-eat"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-xl transition-colors shrink-0"
        >
          <span>View Live Public Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-inkMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search foods (e.g. apple, salmon, chocolate)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-card border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All', value: 'all' },
            { label: 'Safe', value: 'safe' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Toxic', value: 'toxic' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === f.value
                  ? 'bg-forestPrimary text-white shadow-xs'
                  : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Table Grid */}
      <div className="bg-card border border-borderLight rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-canvas border-b border-borderLight text-inkMuted uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Safety Status</th>
                <th className="py-3 px-4">Short Verdict</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-inkPrimary">
              {filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.emoji}</span>
                      <span className="capitalize">{item.name}</span>
                      <span className="text-[11px] text-inkMuted font-mono">/can-dogs-eat/{item.slug}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-4 text-xs text-inkMuted max-w-xs truncate">
                    {item.shortVerdict}
                  </td>
                  <td className="py-3.5 px-4 text-xs capitalize text-inkMuted">{item.category}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-forestPrimary bg-forestLight/60 hover:bg-forestLight rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <Link
                      href={`/can-dogs-eat/${item.slug}`}
                      target="_blank"
                      className="inline-flex items-center p-1 text-inkMuted hover:text-inkPrimary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkPrimary/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-canvas border border-borderLight rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <h3 className="text-lg font-bold text-inkPrimary font-serif flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-forestPrimary" />
                Edit Food Safety Guide: <span className="text-forestPrimary capitalize">{editForm.name}</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-inkMuted hover:text-inkPrimary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Food Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-inkMuted mb-1">Safety Status</label>
                  <select
                    value={editForm.status || 'safe'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as FoodSafetyStatus })}
                    className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  >
                    <option value="safe">SAFE (Healthy treat)</option>
                    <option value="moderate">MODERATE (Serve with caution/prep)</option>
                    <option value="toxic">TOXIC (Dangerous/Lethal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Short Verdict</label>
                <input
                  type="text"
                  value={editForm.shortVerdict || ''}
                  onChange={(e) => setEditForm({ ...editForm, shortVerdict: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Quick Answer (SEO Featured Snippet)</label>
                <input
                  type="text"
                  value={editForm.quickAnswer || ''}
                  onChange={(e) => setEditForm({ ...editForm, quickAnswer: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-inkMuted mb-1">Detailed Vet Review Summary</label>
                <textarea
                  rows={4}
                  value={editForm.vetReviewSummary || ''}
                  onChange={(e) => setEditForm({ ...editForm, vetReviewSummary: e.target.value })}
                  className="w-full p-2.5 bg-card border border-borderLight rounded-xl text-inkPrimary"
                  required
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Food safety guide updated successfully!
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
