'use client';

/**
 * Eternal Paws Platform - Optimized Dog Image Component
 * Path: components/article/OptimizedDogImage.tsx
 * 
 * Provides Zero-CLS responsive media delivery with explicit aspect ratio
 * reservations, modern WebP/AVIF support, and AI disclosure integration.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2, Criteria; PROJECT.md F13
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageDisclosure } from '@/components/trust/ImageDisclosure';
import type { HeroImage } from '@/domain/types';
import { cn } from '@/lib/utils';

export interface OptimizedDogImageProps {
  image?: HeroImage | null;
  heroImage?: HeroImage | null; // Alias for test compatibility
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  showDisclosure?: boolean;
  aspectRatio?: '16:9' | '3:2' | '4:3' | '1:1' | string;
}

const DEFAULT_PLACEHOLDER = '/images/placeholder-dog-editorial.webp';

export const OptimizedDogImage: React.FC<OptimizedDogImageProps> = ({
  image: imageProp,
  heroImage: heroImageProp,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  className,
  containerClassName,
  showDisclosure = true,
  aspectRatio,
}) => {
  const activeImage = imageProp || heroImageProp;
  const [hasError, setHasError] = useState(false);

  // Dimension normalization & fallback (ensures positive dimensions for zero-CLS)
  const width = activeImage?.width && activeImage.width > 0 ? activeImage.width : 1200;
  const height = activeImage?.height && activeImage.height > 0 ? activeImage.height : 675;
  const rawRatio = aspectRatio || activeImage?.aspectRatio || '16:9';
  const cssAspectRatio = rawRatio.includes(':') ? rawRatio.replace(':', '/') : rawRatio;

  // URL Sanitization
  const getSafeUrl = (url?: string): string => {
    if (!url || typeof url !== 'string') return DEFAULT_PLACEHOLDER;
    const trimmed = url.trim();
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:text/html') ||
      trimmed.startsWith('vbscript:') ||
      trimmed.startsWith('file:')
    ) {
      return DEFAULT_PLACEHOLDER;
    }
    return trimmed;
  };

  const srcUrl = hasError ? DEFAULT_PLACEHOLDER : getSafeUrl(activeImage?.url);
  const alt = activeImage?.altText?.trim() || 'Verified dog story photograph';

  return (
    <figure className={cn('w-full my-6 space-y-2', containerClassName)}>
      {/* Zero-CLS Container with Aspect-Ratio Reservation */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-cardMuted border border-borderLight shadow-soft',
          className
        )}
        style={{ aspectRatio: cssAspectRatio }}
        data-aspect-ratio={rawRatio}
      >
        <Image
          src={srcUrl}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes={sizes}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
          unoptimized={srcUrl.startsWith('http://') || srcUrl.startsWith('https://') || srcUrl.startsWith('data:')}
        />
      </div>

      {/* Attribution & AI Visual Reconstruction Disclosure */}
      {showDisclosure && activeImage && (
        <figcaption className="pt-1">
          <ImageDisclosure image={activeImage} />
        </figcaption>
      )}
    </figure>
  );
};

export default OptimizedDogImage;
