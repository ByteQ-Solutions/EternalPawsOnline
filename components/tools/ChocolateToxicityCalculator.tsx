'use client';

import React, { useState, useMemo } from 'react';
import {
  CHOCOLATE_TYPES,
  ChocolateType,
  calculateChocolateToxicity,
  ToxicitySeverity,
} from '@/lib/data/calculators';
import {
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  Info,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  HeartPulse,
} from 'lucide-react';
import Link from 'next/link';

export const ChocolateToxicityCalculator: React.FC = () => {
  // State
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [weightValue, setWeightValue] = useState<number>(35);
  const [selectedChocolate, setSelectedChocolate] = useState<ChocolateType>('milk');
  const [amountUnit, setAmountUnit] = useState<'oz' | 'grams'>('oz');
  const [amountValue, setAmountValue] = useState<number>(3.5);

  // Normalize weight to lbs for calculation
  const effectiveWeightLbs = useMemo(() => {
    return weightUnit === 'lbs' ? weightValue : weightValue * 2.20462;
  }, [weightValue, weightUnit]);

  // Normalize amount to oz for calculation
  const effectiveAmountOz = useMemo(() => {
    return amountUnit === 'oz' ? amountValue : amountValue / 28.3495;
  }, [amountValue, amountUnit]);

  // Calculation result
  const result = useMemo(() => {
    return calculateChocolateToxicity(effectiveWeightLbs, selectedChocolate, effectiveAmountOz);
  }, [effectiveWeightLbs, selectedChocolate, effectiveAmountOz]);

  const getSeverityStyle = (severity: ToxicitySeverity) => {
    switch (severity) {
      case 'safe':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />,
          progressColor: 'bg-emerald-500',
          meterWidth: '20%',
        };
      case 'mild':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />,
          progressColor: 'bg-amber-500',
          meterWidth: '40%',
        };
      case 'moderate':
        return {
          bg: 'bg-orange-50 border-orange-300 text-orange-950',
          badgeBg: 'bg-orange-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />,
          progressColor: 'bg-orange-500',
          meterWidth: '60%',
        };
      case 'severe':
        return {
          bg: 'bg-orange-50 border-orange-400 text-orange-950',
          badgeBg: 'bg-orange-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />,
          progressColor: 'bg-orange-500',
          meterWidth: '80%',
        };
      case 'critical':
      default:
        return {
          bg: 'bg-red-50 border-red-500 text-red-950',
          badgeBg: 'bg-red-600 text-white animate-pulse',
          icon: <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 animate-bounce" />,
          progressColor: 'bg-red-600',
          meterWidth: '100%',
        };
    }
  };

  const currentStyle = getSeverityStyle(result.severity);

  return (
    <div className="space-y-8">
      {/* 24/7 Poison Control Alert Strip */}
      <div className="bg-red-500 text-white rounded-2xl p-4 sm:p-5 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <PhoneCall className="w-7 h-7 flex-shrink-0 animate-pulse text-red-100" />
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-red-200">
              Immediate Veterinary Crisis Line
            </span>
            <p className="font-serif font-bold text-base sm:text-lg">
              ASPCA Animal Poison Control (24/7):{' '}
              <a href="tel:8884264435" className="underline font-sans font-extrabold hover:text-red-100">
                (888) 426-4435
              </a>
            </p>
          </div>
        </div>

        <a
          href="tel:8884264435"
          className="min-h-[44px] px-6 py-2.5 bg-white text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl shadow-soft transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4" /> Call Hotline Now
        </a>
      </div>

      {/* Calculator Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft">
          <div className="border-b border-borderLight pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary flex items-center gap-2">
              <span>🍫</span> Dog & Chocolate Ingestion Details
            </h2>
            <p className="text-xs sm:text-sm text-inkMuted mt-1">
              Enter your dog&apos;s approximate weight and the type/quantity of chocolate eaten.
            </p>
          </div>

          {/* 1. Dog Weight Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="dog-weight-input" className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                1. Dog Body Weight
              </label>
              <div className="flex items-center bg-cardMuted border border-borderLight rounded-lg p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    weightUnit === 'lbs'
                      ? 'bg-forestPrimary text-white shadow-xs'
                      : 'text-inkMuted hover:text-inkPrimary'
                  }`}
                >
                  Pounds (lbs)
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    weightUnit === 'kg'
                      ? 'bg-forestPrimary text-white shadow-xs'
                      : 'text-inkMuted hover:text-inkPrimary'
                  }`}
                >
                  Kilograms (kg)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="dog-weight-input"
                type="number"
                min={1}
                max={250}
                value={weightValue}
                onChange={(e) => setWeightValue(Math.max(1, Number(e.target.value)))}
                className="w-32 min-h-[46px] px-4 py-2 text-lg font-bold font-mono bg-canvas border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary"
              />
              <input
                type="range"
                min={2}
                max={180}
                value={weightValue}
                onChange={(e) => setWeightValue(Number(e.target.value))}
                className="flex-1 accent-forestPrimary cursor-pointer h-2 bg-borderLight rounded-lg"
              />
            </div>
            <p className="text-[11px] text-inkMuted">
              Current: {weightValue} {weightUnit} (~{effectiveWeightLbs.toFixed(1)} lbs / {(effectiveWeightLbs * 0.45359).toFixed(1)} kg)
            </p>
          </div>

          {/* 2. Chocolate Type Radio Selector */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-inkSubtle">
              2. Chocolate Type / Cacao Concentration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(CHOCOLATE_TYPES) as ChocolateType[]).map((type) => {
                const info = CHOCOLATE_TYPES[type];
                const active = selectedChocolate === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedChocolate(type)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-2.5 cursor-pointer ${
                      active
                        ? 'border-forestPrimary bg-forestLight/60 shadow-xs ring-2 ring-forestPrimary/20'
                        : 'border-borderLight bg-canvas hover:bg-cardMuted'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-inkPrimary truncate">{info.name}</span>
                      </div>
                      <span className="text-[10px] text-inkMuted line-clamp-1 mt-0.5">
                        {info.theobromineMgPerOz} mg theobromine/oz
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Amount Eaten Input */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="amount-eaten-input" className="text-xs font-bold uppercase tracking-wider text-inkSubtle">
                3. Estimated Amount Eaten
              </label>
              <div className="flex items-center bg-cardMuted border border-borderLight rounded-lg p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAmountUnit('oz')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    amountUnit === 'oz'
                      ? 'bg-forestPrimary text-white shadow-xs'
                      : 'text-inkMuted hover:text-inkPrimary'
                  }`}
                >
                  Ounces (oz)
                </button>
                <button
                  type="button"
                  onClick={() => setAmountUnit('grams')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    amountUnit === 'grams'
                      ? 'bg-forestPrimary text-white shadow-xs'
                      : 'text-inkMuted hover:text-inkPrimary'
                  }`}
                >
                  Grams (g)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="amount-eaten-input"
                type="number"
                step="0.1"
                min={0.1}
                max={50}
                value={amountValue}
                onChange={(e) => setAmountValue(Math.max(0.1, Number(e.target.value)))}
                className="w-32 min-h-[46px] px-4 py-2 text-lg font-bold font-mono bg-canvas border border-borderLight rounded-xl text-inkPrimary focus:outline-none focus:ring-2 focus:ring-forestPrimary"
              />
              <input
                type="range"
                step="0.1"
                min={0.5}
                max={20}
                value={amountValue}
                onChange={(e) => setAmountValue(Number(e.target.value))}
                className="flex-1 accent-forestPrimary cursor-pointer h-2 bg-borderLight rounded-lg"
              />
            </div>

            {/* Quick reference guide */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-inkMuted">
              <span>Quick reference:</span>
              <button
                type="button"
                onClick={() => {
                  setAmountUnit('oz');
                  setAmountValue(1.55);
                }}
                className="underline hover:text-forestPrimary"
              >
                Standard Hershey Bar (1.55 oz)
              </button>
              •
              <button
                type="button"
                onClick={() => {
                  setAmountUnit('oz');
                  setAmountValue(3.5);
                }}
                className="underline hover:text-forestPrimary"
              >
                Standard Dark Chocolate Bar (3.5 oz / 100g)
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Real-Time Results & Clinical Gauge (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-7 space-y-5 transition-all shadow-elevated ${currentStyle.bg}`}>
            {/* Header / Severity Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {currentStyle.icon}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                    Clinical Toxicity Assessment
                  </span>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase mt-1 ${currentStyle.badgeBg}`}>
                    {result.severity.toUpperCase()} SEVERITY
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Dose Metrics */}
            <div className="grid grid-cols-2 gap-2 p-3.5 bg-white/80 backdrop-blur-xs rounded-2xl border border-borderLight/60 text-center">
              <div>
                <span className="text-[10px] text-inkMuted uppercase font-bold block">
                  Total Toxins Ingested
                </span>
                <span className="text-base font-bold font-mono text-inkPrimary">
                  {result.totalMethylxanthinesMg} mg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-inkMuted uppercase font-bold block">
                  Toxicity Dose Rate
                </span>
                <span className="text-base font-bold font-mono text-inkPrimary">
                  {result.doseMgPerKg} mg/kg
                </span>
              </div>
            </div>

            {/* Visual Risk Gauge Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Safe (&lt;20)</span>
                <span>Mild (20-40)</span>
                <span>Severe (40-60)</span>
                <span>Lethal (60+)</span>
              </div>
              <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-black/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${currentStyle.progressColor}`}
                  style={{ width: currentStyle.meterWidth }}
                />
              </div>
            </div>

            {/* Headline & Summary */}
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold leading-snug">
                {result.headline}
              </h3>
              <p className="text-xs leading-relaxed opacity-90">
                {result.summary}
              </p>
            </div>

            {/* Expected Symptoms */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <span className="text-xs font-bold uppercase tracking-wider block">
                🚨 Anticipated Symptoms:
              </span>
              <ul className="space-y-1 text-xs list-disc pl-4 leading-relaxed">
                {result.expectedSymptoms.map((sym, idx) => (
                  <li key={idx}>{sym}</li>
                ))}
              </ul>
            </div>

            {/* Action Required */}
            <div className="p-4 bg-white/90 rounded-2xl border border-black/10 space-y-1">
              <span className="text-[11px] font-bold uppercase text-red-700 block">
                Mandatory Action Protocol:
              </span>
              <p className="text-xs font-semibold text-inkPrimary leading-relaxed">
                {result.actionRequired}
              </p>
            </div>
          </div>

          {/* Contextual Link to Vet Protocol */}
          <div className="bg-card border border-borderLight rounded-3xl p-6 space-y-3 shadow-soft">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              <h4 className="font-serif text-base font-bold text-inkPrimary">
                Full Veterinary Emergency Protocol
              </h4>
            </div>
            <p className="text-xs text-inkMuted leading-relaxed">
              Read our vet-reviewed 3-step emergency action guide on induced vomiting safety, activated charcoal, and hospital care.
            </p>
            <Link
              href="/wellness/chocolate-toxicity-dog-emergency-protocol"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forestPrimary hover:underline"
            >
              <span>Read Full Emergency Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
