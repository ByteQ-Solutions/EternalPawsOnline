import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const skeletonVariants = cva(
  'animate-pulse bg-cardMuted select-none',
  {
    variants: {
      variant: {
        text: 'h-4 w-full rounded',
        rectangular: 'rounded-md',
        circular: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'rectangular',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, aspectRatio, style, ...props }, ref) => {
    const customStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
      ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
      ...(aspectRatio !== undefined ? { aspectRatio } : {}),
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={customStyle}
        className={cn(skeletonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
