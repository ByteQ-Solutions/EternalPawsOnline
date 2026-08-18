'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    items.forEach((item) => {
      if (item.defaultOpen) {
        initial.add(item.id);
      }
    });
    return initial;
  });

  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const totalItems = items.length;
    let targetIndex = -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (index + 1) % totalItems;
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (index - 1 + totalItems) % totalItems;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = totalItems - 1;
        break;
    }

    if (targetIndex >= 0) {
      const targetId = items[targetIndex].id;
      buttonRefs.current.get(targetId)?.focus();
    }
  };

  return (
    <div className={cn('space-y-2 divide-y divide-borderLight/60', className)}>
      {items.map((item, index) => {
        const isOpen = openItemIds.has(item.id);
        const buttonId = `accordion-button-${item.id}`;
        const regionId = `accordion-region-${item.id}`;

        return (
          <div key={item.id} className="pt-2 first:pt-0">
            <h3>
              <button
                id={buttonId}
                ref={(el) => {
                  if (el) buttonRefs.current.set(item.id, el);
                  else buttonRefs.current.delete(item.id);
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex items-center justify-between w-full min-h-[44px] py-3 text-left font-serif text-lg font-semibold text-inkPrimary hover:text-forestPrimary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-md px-1"
              >
                <span>{item.title}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-inkSubtle transition-transform duration-200 flex-shrink-0 ml-2',
                    isOpen && 'transform rotate-180 text-forestPrimary'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={regionId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn(
                'text-sm text-inkMuted leading-relaxed px-1 pb-4 pt-1',
                !isOpen && 'hidden'
              )}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
