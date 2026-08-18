import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const containerVariants = cva(
  'w-full mx-auto px-4 sm:px-6 lg:px-8',
  {
    variants: {
      size: {
        reading: 'max-w-3xl',
        default: 'max-w-6xl',
        wide: 'max-w-7xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: 'div' | 'section' | 'article' | 'main';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

export default Container;
