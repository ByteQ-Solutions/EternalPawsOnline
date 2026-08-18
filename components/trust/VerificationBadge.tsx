'use client';

import * as React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/domain/types';

export interface VerificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: VerificationStatus;
  confidenceScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDot?: boolean;
  showScore?: boolean;
}

export const verificationTierConfig: Record<
  VerificationStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    description: string;
  }
> = {
  'Strongly Verified': {
    label: 'Strongly Verified',
    bgClass: 'bg-[#EBF3ED]',
    textClass: 'text-[#234E35]',
    borderClass: 'border-[#234E35]/30',
    dotClass: 'bg-[#234E35]',
    icon: ShieldCheck,
    description: 'Corroborated by multiple primary institutional sources with official documentation.',
  },
  'Verified': {
    label: 'Verified',
    bgClass: 'bg-[#EBF3ED]',
    textClass: 'text-[#234E35]',
    borderClass: 'border-[#78A083]/40',
    dotClass: 'bg-[#234E35]',
    icon: CheckCircle2,
    description: 'Corroborated by verified shelter, police, or veterinary clinic records.',
  },
  'Partially Verified': {
    label: 'Partially Verified',
    bgClass: 'bg-[#FEF7EC]',
    textClass: 'text-[#8A5200]',
    borderClass: 'border-[#C97A1E]/30',
    dotClass: 'bg-[#C97A1E]',
    icon: AlertTriangle,
    description: 'Single community or eyewitness source under active editorial verification.',
  },
  'Unverified': {
    label: 'Unverified',
    bgClass: 'bg-[#F4F0EA]',
    textClass: 'text-[#555555]',
    borderClass: 'border-[#E8E3DA]',
    dotClass: 'bg-[#767676]',
    icon: HelpCircle,
    description: 'Community submission undergoing initial editorial fact-checking intake.',
  },
};

export const VerificationBadge = React.forwardRef<HTMLSpanElement, VerificationBadgeProps>(
  (
    {
      status,
      confidenceScore,
      size = 'sm',
      showIcon = true,
      showDot = false,
      showScore = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = verificationTierConfig[status] || verificationTierConfig['Unverified'];
    const Icon = config.icon;

    const sizeClasses = {
      sm: 'px-2.5 py-0.5 text-xs gap-1.5 min-h-[24px]',
      md: 'px-3 py-1 text-sm gap-2 min-h-[28px]',
      lg: 'px-3.5 py-1.5 text-base gap-2.5 min-h-[36px]',
    }[size];

    const iconSizeClasses = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }[size];

    return (
      <span
        ref={ref}
        role="status"
        aria-label={`Verification status: ${config.label}${confidenceScore !== undefined ? `, confidence score ${confidenceScore}%` : ''}`}
        title={config.description}
        className={cn(
          'inline-flex items-center font-semibold rounded-full border transition-colors select-none',
          config.bgClass,
          config.textClass,
          config.borderClass,
          sizeClasses,
          className
        )}
        {...props}
      >
        {showDot && (
          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dotClass)} aria-hidden="true" />
        )}
        {showIcon && <Icon className={cn(iconSizeClasses, 'flex-shrink-0')} aria-hidden="true" />}
        <span>{config.label}</span>
        {showScore && confidenceScore !== undefined && (
          <span className="font-mono text-xs opacity-90 pl-0.5" aria-hidden="true">
            ({confidenceScore}%)
          </span>
        )}
      </span>
    );
  }
);

VerificationBadge.displayName = 'VerificationBadge';
export default VerificationBadge;
