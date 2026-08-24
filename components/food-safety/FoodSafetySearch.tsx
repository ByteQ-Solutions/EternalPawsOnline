'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ShieldCheck, AlertTriangle, Skull, Filter } from 'lucide-react';
import { FoodSafetyItem, FoodSafetyStatus, FoodCategory } from '@/lib/data/food-safety';
import { FoodCard } from './FoodCard';

export interface FoodSafetySearchProps {
  initialItems: FoodSafetyItem[];
}

export const FoodSafetySearch: React.FC<FoodSafetySearchProps> = ({ initialItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FoodSafetyStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FoodCategory>('all');

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // 2. Category Filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // 3. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchVerdict = item.shortVerdict.toLowerCase().includes(query);
        const matchAnswer = item.quickAnswer.toLowerCase().includes(query);
        const matchBenefits = item.benefits.some((b) => b.toLowerCase().includes(query));
        return matchName || matchVerdict || matchAnswer || matchBenefits;
      }
      return true;
    });
  }, [initialItems, searchTerm, statusFilter, categoryFilter]);

  const counts = useMemo(() => {
    return {
      all: initialItems.length,
      safe: initialItems.filter((i) => i.status === 'safe').length,
      moderate: initialItems.filter((i) => i.status === 'moderate').length,
      toxic: initialItems.filter((i) => i.status === 'toxic').length,
    };
  }, [initialItems]);

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-inkSubtle absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type any food: apple, chicken, watermelon, chocolate, carrots..."
            className="w-full min-h-[52px] pl-12 pr-12 bg-card border border-borderLight rounded-2xl text-sm md:text-base font-medium text-inkPrimary placeholder:text-inkSubtle focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:outline-none shadow-soft transition-all"
            aria-label="Search dog food safety database"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 p-1 rounded-full text-inkSubtle hover:text-inkPrimary hover:bg-cardMuted transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-borderLight pb-4">
        {/* Safety Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-forestPrimary text-white shadow-soft'
                : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
            }`}
          >
            All Foods ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('safe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'safe'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'bg-emerald-50/70 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 🟢 100% Safe ({counts.safe})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('moderate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'moderate'
                ? 'bg-amber-600 text-white shadow-soft'
                : 'bg-amber-50/70 border border-amber-200 text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> 🟡 Caution ({counts.moderate})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('toxic')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'toxic'
                ? 'bg-red-600 text-white shadow-soft'
                : 'bg-red-50/70 border border-red-200 text-red-800 hover:bg-red-100/70'
            }`}
          >
            <Skull className="w-3.5 h-3.5" /> 🔴 Toxic Danger ({counts.toxic})
          </button>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-inkSubtle" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="min-h-[36px] px-3 py-1.5 bg-card border border-borderLight rounded-xl text-xs font-bold text-inkPrimary focus-visible:ring-2 focus-visible:ring-forestPrimary cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="fruits">🍏 Fruits</option>
            <option value="vegetables">🥕 Vegetables</option>
            <option value="meats_proteins">🥩 Meats & Proteins</option>
            <option value="dairy_grains">🧀 Dairy & Grains</option>
            <option value="human_foods">🍽️ Human Foods & Treats</option>
          </select>
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-borderLight rounded-3xl space-y-3">
          <span className="text-4xl">🐾</span>
          <h3 className="font-serif text-lg font-bold text-inkPrimary">
            No foods found matching &ldquo;{searchTerm}&rdquo;
          </h3>
          <p className="text-xs text-inkMuted max-w-md mx-auto">
            Try checking another food name, clearing your filters, or browsing our full list of safe and toxic foods above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-forestPrimary text-white rounded-xl text-xs font-bold shadow-soft hover:bg-forestDark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
