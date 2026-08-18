import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 select-none touch-manipulation',
  {
    variants: {
      variant: {
        primary:
          'bg-forestPrimary text-white hover:bg-forestHover active:scale-[0.98] shadow-soft',
        secondary:
          'bg-forestLight text-forestPrimary hover:bg-forestLight/80 active:scale-[0.98]',
        outline:
          'border border-borderLight bg-card text-inkPrimary hover:bg-cardMuted hover:border-inkMuted/30 active:scale-[0.98]',
        ghost:
          'text-inkPrimary hover:bg-cardMuted active:bg-cardMuted/80 active:scale-[0.98]',
        gold:
          'bg-goldAccent text-white hover:bg-[#B56A15] active:scale-[0.98] shadow-soft',
      },
      size: {
        sm: 'min-h-[44px] min-w-[44px] px-3 py-2 text-sm rounded-md gap-1.5',
        md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-base rounded-md gap-2',
        lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg font-semibold rounded-lg gap-2.5',
        icon: 'min-h-[44px] min-w-[44px] p-2.5 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          aria-disabled={disabled || isLoading}
          tabIndex={disabled || isLoading ? -1 : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? true : undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
