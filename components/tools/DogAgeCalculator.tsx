'use client';

import React, { useState, useMemo } from 'react';
import {
  DOG_BREED_SIZES,
  DogBreedSize,
  calculateDogHumanAge,
  DogLifeStage,
} from '@/lib/data/calculators';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Stethoscope,
  Bone,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';

export const DogAgeCalculator: React.FC = () => {
  // State
  const [ageYears, setAgeYears] = useState<number>(4);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [selectedBreedSize, setSelectedBreedSize] = useState<DogBreedSize>('medium');

  // Calculation result
  const result = useMemo(() => {
    return calculateDogHumanAge(ageYears, ageMonths, selectedBreedSize);
  }, [ageYears, ageMonths, selectedBreedSize]);

  const sizeInfo = DOG_BREED_SIZES[selectedBreedSize];

  const getLifeStageTheme = (stage: DogLifeStage) => {
    switch (stage) {
      case 'puppy':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          pill: 'bg-emerald-100 text-emerald-800',
        };
      case 'young_adult':
        return {
          bg: 'bg-teal-50 border-teal-300 text-teal-950',
          badge: 'bg-teal-600 text-white',
          pill: 'bg-teal-100 text-teal-800',
        };
      case 'mature_adult':
        return {
          bg: 'bg-blue-50 border-blue-300 text-blue-950',
          badge: 'bg-blue-600 text-white',
          pill: 'bg-blue-100 text-blue-800',
        };
      case 'senior':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          pill: 'bg-amber-100 text-amber-800',
        };
      case 'geriatric':
      default:
        return {
          bg: 'bg-purple-50 border-purple-300 text-purple-950',
          badge: 'bg-purple-600 text-white',
          pill: 'bg-purple-100 text-purple-800',
        };
    }
  };

  const currentTheme = getLifeStageTheme(result.lifeStage);

  return (
    <div className="space-y-8">
      {/* Calculator Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
          <div className="border-b border-borderLight pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary flex items-center gap-2">
              <span>🎂</span> Dog Age & Breed Size Calculator
            </h2>
            <p className="text-xs sm:text-sm text-inkMuted mt-1">
              Based on the American Veterinary Medical Association (AVMA) non-linear life stage curve.
            </p>
          </div>

          {/* 1. Breed Size Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
              1. Select Dog Breed Size / Adult Weight
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(DOG_BREED_SIZES) as DogBreedSize[]).map((size) => {
                const info = DOG_BREED_SIZES[size];
                const active = selectedBreedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedBreedSize(size)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      active
                        ? 'border-forestPrimary bg-forestLight/60 shadow-xs ring-2 ring-forestPrimary/20'
                        : 'border-borderLight bg-canvas hover:bg-cardMuted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-inkPrimary">{info.name}</span>
                      <span className="text-[10px] font-bold text-forestPrimary bg-white px-2 py-0.5 rounded-full border border-borderLight">
                        {info.weightRange}
                      </span>
                    </div>
                    <p className="text-[11px] text-inkMuted line-clamp-2">
                      {info.sampleBreeds}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chronological Age Inputs */}
          <div className="space-y-4 pt-2 border-t border-borderLight">
            <label className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
              2. Dog&apos;s Current Chronological Age
            </label>

            {/* Years */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-inkPrimary">Years: {ageYears}</span>
                <span className="text-inkMuted font-mono">0 to 20 years</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Math.max(0, Number(e.target.value)))}
                  className="w-24 min-h-[44px] px-3 py-2 text-lg font-bold font-mono bg-canvas border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary"
                />
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="flex-1 accent-forestPrimary cursor-pointer h-2 bg-borderLight rounded-lg"
                />
              </div>
            </div>

            {/* Additional Months */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-inkPrimary">Additional Months: {ageMonths}</span>
                <span className="text-inkMuted font-mono">0 to 11 months</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Math.min(11, Math.max(0, Number(e.target.value))))}
                  className="w-24 min-h-[44px] px-3 py-2 text-lg font-bold font-mono bg-canvas border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary"
                />
                <input
                  type="range"
                  min={0}
                  max={11}
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="flex-1 accent-forestPrimary cursor-pointer h-2 bg-borderLight rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Human Years Result & Life Stage Care (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Big Result Card */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 transition-all shadow-elevated ${currentTheme.bg}`}>
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75 block">
                Calculated Equivalent Human Age
              </span>
              <div className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-inkPrimary">
                {result.humanYears}{' '}
                <span className="text-xl sm:text-2xl font-normal opacity-75 font-sans">Human Years</span>
              </div>
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold ${currentTheme.badge}`}>
                {result.lifeStageLabel}
              </span>
            </div>

            {/* Description */}
            <div className="p-4 bg-white/80 rounded-2xl border border-black/10 text-xs leading-relaxed text-inkPrimary space-y-1">
              <span className="font-bold text-[11px] uppercase opacity-75 block">Life Stage Overview:</span>
              <p>{result.stageDescription}</p>
            </div>

            {/* Health Checklist */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <span className="text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-forestPrimary" />
                Priority Health & Veterinary Milestones:
              </span>
              <ul className="space-y-1.5 text-xs">
                {result.healthChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forestPrimary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition & Vet Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-3 bg-white/90 rounded-xl border border-black/10 space-y-0.5">
                <span className="text-[10px] font-bold uppercase opacity-75 block">Recommended Checkups</span>
                <span className="font-bold text-inkPrimary">{result.recommendedVetVisitFrequency}</span>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-black/10 space-y-0.5">
                <span className="text-[10px] font-bold uppercase opacity-75 block">Senior Transition</span>
                <span className="font-bold text-inkPrimary">Age {sizeInfo.seniorAgeThreshold}+ years</span>
              </div>
            </div>
          </div>

          {/* Contextual Link to Senior Care Guide */}
          <div className="bg-card border border-borderLight rounded-3xl p-6 space-y-3 shadow-soft">
            <div className="flex items-center gap-2">
              <Bone className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-base font-bold text-inkPrimary">
                Senior Dog Joint Care & Mobility Guide
              </h4>
            </div>
            <p className="text-xs text-inkMuted leading-relaxed">
              Learn how to keep your aging dog active, comfortable, and pain-free with evidence-based Omega-3s and home adaptations.
            </p>
            <Link
              href="/wellness/natural-joint-care-arthritis-senior-dogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forestPrimary hover:underline"
            >
              <span>Explore Senior Dog Care Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Breed Quick-Conversion Matrix for Google Featured Snippets */}
      <div className="bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-borderLight pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-inkPrimary flex items-center gap-2">
              <span>📊</span> Popular Breed Age Conversion Chart (Human Years)
            </h3>
            <p className="text-xs sm:text-sm text-inkMuted mt-0.5">
              Quick veterinary reference based on AVMA life-stage curves for popular dog breeds.
            </p>
          </div>
          <span className="text-[11px] font-bold text-forestPrimary bg-forestLight px-3 py-1 rounded-full w-fit">
            AVMA Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderLight bg-canvas text-inkSubtle font-bold uppercase tracking-wider">
                <th className="p-3 rounded-l-xl">Dog Breed & Size</th>
                <th className="p-3 text-center">1 Year</th>
                <th className="p-3 text-center">3 Years</th>
                <th className="p-3 text-center">5 Years</th>
                <th className="p-3 text-center">7 Years (Senior)</th>
                <th className="p-3 text-center">10 Years</th>
                <th className="p-3 text-center rounded-r-xl">12+ Years</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 font-sans">
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  🐕 Golden Retriever <span className="text-[10px] text-inkMuted font-normal">(Large, 55-75 lbs)</span>
                </td>
                <td className="p-3 text-center">15 yrs</td>
                <td className="p-3 text-center">26 yrs</td>
                <td className="p-3 text-center">38 yrs</td>
                <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/60 rounded">50 yrs</td>
                <td className="p-3 text-center">66 yrs</td>
                <td className="p-3 text-center font-bold text-purple-700">77 yrs</td>
              </tr>
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  🦮 Labrador Retriever <span className="text-[10px] text-inkMuted font-normal">(Large, 55-80 lbs)</span>
                </td>
                <td className="p-3 text-center">15 yrs</td>
                <td className="p-3 text-center">26 yrs</td>
                <td className="p-3 text-center">38 yrs</td>
                <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/60 rounded">50 yrs</td>
                <td className="p-3 text-center">66 yrs</td>
                <td className="p-3 text-center font-bold text-purple-700">77 yrs</td>
              </tr>
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  🛡️ German Shepherd <span className="text-[10px] text-inkMuted font-normal">(Large, 50-90 lbs)</span>
                </td>
                <td className="p-3 text-center">15 yrs</td>
                <td className="p-3 text-center">26 yrs</td>
                <td className="p-3 text-center">38 yrs</td>
                <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/60 rounded">50 yrs</td>
                <td className="p-3 text-center">66 yrs</td>
                <td className="p-3 text-center font-bold text-purple-700">77 yrs</td>
              </tr>
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  🐾 French Bulldog <span className="text-[10px] text-inkMuted font-normal">(Small/Med, 20-28 lbs)</span>
                </td>
                <td className="p-3 text-center">15 yrs</td>
                <td className="p-3 text-center">28 yrs</td>
                <td className="p-3 text-center">36 yrs</td>
                <td className="p-3 text-center">44 yrs</td>
                <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/60 rounded">56 yrs</td>
                <td className="p-3 text-center font-bold text-purple-700">64 yrs</td>
              </tr>
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  🐶 Chihuahua / Yorkie <span className="text-[10px] text-inkMuted font-normal">(Toy/Small, &lt;15 lbs)</span>
                </td>
                <td className="p-3 text-center">15 yrs</td>
                <td className="p-3 text-center">28 yrs</td>
                <td className="p-3 text-center">36 yrs</td>
                <td className="p-3 text-center">44 yrs</td>
                <td className="p-3 text-center">56 yrs</td>
                <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/60 rounded">64 yrs</td>
              </tr>
              <tr className="hover:bg-cardMuted/50 transition-colors">
                <td className="p-3 font-bold text-inkPrimary">
                  ⛰️ Great Dane / Mastiff <span className="text-[10px] text-inkMuted font-normal">(Giant, &gt;90 lbs)</span>
                </td>
                <td className="p-3 text-center">12 yrs</td>
                <td className="p-3 text-center">26 yrs</td>
                <td className="p-3 text-center font-bold text-amber-700 bg-amber-50/60 rounded">45 yrs (Senior)</td>
                <td className="p-3 text-center font-bold text-purple-700">56 yrs</td>
                <td className="p-3 text-center font-bold text-purple-800">78 yrs</td>
                <td className="p-3 text-center text-inkSubtle">85+ yrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
