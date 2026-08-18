'use client';

import React from 'react';

export interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-forestPrimary focus:text-white focus:font-semibold focus:text-sm focus:rounded-md focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 focus:ring-offset-canvas transition-transform duration-150 ${className}`}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
