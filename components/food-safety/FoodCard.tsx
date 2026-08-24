'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Skull, ArrowRight, Sparkles } from 'lucide-react';
import { FoodSafetyItem } from '@/lib/data/food-safety';
import { Badge } from '@/design-system/components/Badge';

export interface FoodCardProps {
  item: FoodSafetyItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const getStatusConfig = () => {
    switch (item.status) {
      case 'safe':
        return {
          badgeText: 'Safe & Healthy',
          badgeVariant: 'forest' as const,
          borderColor: 'hover:border-emerald-500/50',
          bgColor: 'bg-emerald-50/40 dark:bg-emerald-950/20',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          textColor: 'text-emerald-700 dark:text-emerald-400',
        };
      case 'moderate':
        return {
          badgeText: 'Caution / Moderate',
          badgeVariant: 'gold' as const,
          borderColor: 'hover:border-amber-500/50',
          bgColor: 'bg-amber-50/40 dark:bg-amber-950/20',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          textColor: 'text-amber-700 dark:text-amber-400',
        };
      case 'toxic':
        return {
          badgeText: 'Strictly Toxic',
          badgeVariant: 'unverified' as const,
          borderColor: 'hover:border-red-500/60 border-red-200/80',
          bgColor: 'bg-red-50/50 dark:bg-red-950/30',
          icon: <Skull className="w-4 h-4 text-red-600 dark:text-red-400" />,
          textColor: 'text-red-700 dark:text-red-400',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Link
      href={`/can-dogs-eat/${item.slug}`}
      className={`group flex flex-col justify-between p-5 rounded-2xl bg-card border border-borderLight transition-all duration-300 shadow-soft hover:shadow-hover hover:-translate-y-1 ${config.borderColor} ${config.bgColor}`}
    >
      <div className="space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              {item.emoji}
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors">
                {item.name}
              </h3>
              <span className="text-[11px] font-medium text-inkSubtle capitalize">
                {item.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant={config.badgeVariant} size="sm" className="font-semibold text-[11px] gap-1 shadow-xs">
              {config.icon}
              <span>{config.badgeText}</span>
            </Badge>
          </div>
        </div>

        {/* Short Verdict */}
        <p className={`text-xs font-bold leading-snug ${config.textColor}`}>
          {item.shortVerdict}
        </p>

        {/* Quick Summary */}
        <p className="text-xs text-inkMuted leading-relaxed line-clamp-2">
          {item.quickAnswer}
        </p>
      </div>

      {/* Footer link */}
      <div className="pt-4 mt-3 border-t border-borderLight/60 flex items-center justify-between text-xs font-bold text-forestPrimary group-hover:text-forestDark">
        <span>Read Vet Nutritional Guide</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
