'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Skull, AlertTriangle, ArrowRight, Sparkles, HeartPulse } from 'lucide-react';
import { allFoodSafetyItems } from '@/lib/data/food-safety';

export const FoodSafetyHeroWidget: React.FC = () => {
  const [query, setQuery] = useState('');

  const quickPills = [
    { name: 'Apples', emoji: '🍎', slug: 'apples', status: 'safe', label: 'Safe' },
    { name: 'Chocolate', emoji: '🍫', slug: 'chocolate', status: 'toxic', label: 'Toxic' },
    { name: 'Carrots', emoji: '🥕', slug: 'carrots', status: 'safe', label: 'Safe' },
    { name: 'Grapes', emoji: '🍇', slug: 'grapes-and-raisins', status: 'toxic', label: 'Toxic' },
    { name: 'Watermelon', emoji: '🍉', slug: 'watermelon', status: 'safe', label: 'Safe' },
    { name: 'Chicken', emoji: '🍗', slug: 'chicken', status: 'safe', label: 'Safe' },
  ];

  const searchResults = query.trim()
    ? allFoodSafetyItems.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase().trim())
      ).slice(0, 4)
    : [];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-forestPrimary to-forestDark text-white p-6 sm:p-8 md:p-10 shadow-soft">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-goldAccent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-bold tracking-wider uppercase">
          <HeartPulse className="w-3.5 h-3.5 text-goldLight" />
          <span>Canine Nutrition & Safety Hub</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
          Can My Dog Eat This?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
          Instant vet-reviewed safety checks, portion guides, and toxicity warnings for 40+ common foods.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-inkSubtle absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apple, peanut butter, cheese, onions..."
              className="w-full min-h-[50px] pl-12 pr-4 bg-white text-inkPrimary rounded-2xl text-sm font-medium placeholder:text-inkSubtle focus-visible:ring-4 focus-visible:ring-emerald-400/50 shadow-md transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-borderLight rounded-2xl shadow-xl overflow-hidden z-30 text-left divide-y divide-borderLight">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/can-dogs-eat/${item.slug}`}
                  className="flex items-center justify-between p-3.5 hover:bg-cardMuted transition-colors text-inkPrimary"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-bold">{item.name}</div>
                      <div className="text-[11px] text-inkMuted truncate max-w-xs">{item.shortVerdict}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      item.status === 'safe'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Popular Food Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-emerald-200 text-xs font-medium mr-1">Popular:</span>
          {quickPills.map((pill) => (
            <Link
              key={pill.slug}
              href={`/can-dogs-eat/${pill.slug}`}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm ${
                pill.status === 'safe'
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  : 'bg-red-500/30 hover:bg-red-500/40 text-red-100 border border-red-400/40'
              }`}
            >
              <span>{pill.emoji}</span>
              <span>{pill.name}</span>
              <span
                className={`text-[9px] px-1 rounded font-mono uppercase ${
                  pill.status === 'safe' ? 'bg-emerald-500/50 text-white' : 'bg-red-600/70 text-white'
                }`}
              >
                {pill.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Explore All Link */}
        <div className="pt-3">
          <Link
            href="/can-dogs-eat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-goldLight text-forestDark font-bold text-xs shadow-soft hover:bg-white transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Full 40+ Food Safety Database</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
