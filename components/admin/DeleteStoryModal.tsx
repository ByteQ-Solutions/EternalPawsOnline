'use client';

/**
 * Eternal Paws Platform - Editorial Story Delete Confirmation Modal
 * Path: components/admin/DeleteStoryModal.tsx
 */

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/design-system/components/Button';
import { Story } from '@/domain/types';

export interface DeleteStoryModalProps {
  isOpen: boolean;
  story: Story | null;
  onClose: () => void;
  onStoryDeleted: (deletedStoryId: string) => void;
}

export const DeleteStoryModal: React.FC<DeleteStoryModalProps> = ({
  isOpen,
  story,
  onClose,
  onStoryDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !story) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/stories/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: story.id, slug: story.slug }),
      });

      const data = await res.json();
      if (data.success) {
        onStoryDeleted(story.id);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to delete story.');
      }
    } catch {
      setErrorMsg('Network error while deleting story.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkPrimary/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-card border border-borderLight rounded-2xl shadow-elevated p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel and close dialog"
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-inkMuted hover:text-inkPrimary hover:bg-cardMuted transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-error flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="font-serif text-lg font-bold text-inkPrimary">
              Delete Story?
            </h2>
            <p className="text-xs text-inkMuted mt-0.5">This action permanently deletes the story.</p>
          </div>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-error font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="p-4 bg-cardMuted/60 border border-borderLight rounded-xl text-xs space-y-1">
          <span className="font-bold text-inkPrimary block">{story.title}</span>
          <span className="text-inkSubtle font-mono block">Slug: /stories/{story.slug}</span>
        </div>

        <p className="text-xs text-inkMuted leading-relaxed">
          Are you sure you want to remove <strong>{story.dogName}&apos;s</strong> story from the live publication corpus?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-borderLight text-inkMuted hover:text-inkPrimary hover:bg-cardMuted text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <Button
            type="button"
            variant="primary"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="min-h-[44px] px-5 bg-error hover:bg-red-700 text-white text-xs font-bold shadow-soft"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete Story
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStoryModal;
