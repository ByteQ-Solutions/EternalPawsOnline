import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-cardMuted text-inkPrimary border border-borderLight',
        forest: 'bg-forestLight text-forestPrimary border border-forestPrimary/20',
        gold: 'bg-goldLight text-goldDark border border-goldAccent/30',
        outline: 'border border-borderLight text-inkMuted bg-transparent',
        verified: 'bg-[#EBF3ED] text-[#1B3D2A] border border-[#234E35]/30 font-semibold',
        partiallyVerified: 'bg-[#FEF7EC] text-[#8A5200] border border-[#C97A1E]/30 font-semibold',
        unverified: 'bg-[#F4F0EA] text-[#555555] border border-[#E8E3DA] font-semibold',
        aiDisclosure: 'bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-mono text-xs',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size, dot = false, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'verified' && 'bg-forestPrimary',
              variant === 'partiallyVerified' && 'bg-goldAccent',
              variant === 'unverified' && 'bg-inkSubtle',
              variant === 'forest' && 'bg-forestPrimary',
              variant === 'gold' && 'bg-goldAccent',
              variant === 'default' && 'bg-inkPrimary',
              variant === 'outline' && 'bg-inkMuted',
              variant === 'aiDisclosure' && 'bg-blue-500'
            )}
            aria-hidden="true"
          />
        )}
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
