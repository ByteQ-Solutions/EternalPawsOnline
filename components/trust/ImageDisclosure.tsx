'use client';

import * as React from 'react';
import { Sparkles, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HeroImage } from '@/domain/types';

export interface ImageDisclosureProps {
  image: HeroImage;
  className?: string;
  variant?: 'badge' | 'caption' | 'inline';
}

export const ImageDisclosure: React.FC<ImageDisclosureProps> = ({
  image,
  className,
  variant = 'caption',
}) => {
  const isAiReconstruction = image.licenseType === 'ai_visual_reconstruction';

  if (isAiReconstruction) {
    const aiData = image.aiDisclosure;
    return (
      <div
        role="note"
        aria-label="Image Transparency Disclosure: AI Visual Reconstruction"
        className={cn(
          'p-3.5 rounded-lg bg-[#FEF7EC] border border-[#C97A1E]/30 text-inkPrimary text-xs space-y-1.5',
          className
        )}
      >
        <div className="flex items-center gap-2 font-semibold text-[#8A5200]">
          <Sparkles className="w-4 h-4 text-goldAccent flex-shrink-0" aria-hidden="true" />
          <span>AI Visual Reconstruction • Transparency Disclosed</span>
        </div>

        <p className="text-inkMuted leading-relaxed">
          {aiData?.reconstructionRationale ||
            'Original photographs were unavailable during emergency evacuation; visual scene reconstructed strictly based on verified veterinary blueprints and eyewitness descriptions.'}
        </p>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-inkSubtle border-t border-[#C97A1E]/20 text-[11px]">
          <span>Tool: {aiData?.aiToolUsed || 'Editorial AI Reconstruction Lab'}</span>
          <span>Ethics Pledge: We never use AI to fabricate story events.</span>
        </div>
      </div>
    );
  }

  // Standard Photography Credit
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 text-xs text-inkMuted pt-1.5 px-1',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Camera className="w-3.5 h-3.5 text-inkSubtle flex-shrink-0" aria-hidden="true" />
        <span>
          Photo: <strong className="text-inkPrimary font-medium">{image.credit || 'Eternal Paws Archive'}</strong>
        </span>
      </div>

      <span className="text-inkSubtle text-[11px] uppercase tracking-wider font-semibold">
        {image.licenseType.replace(/_/g, ' ')}
      </span>
    </div>
  );
};

export default ImageDisclosure;
