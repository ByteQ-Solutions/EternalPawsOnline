import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHomeIcon = true,
}) => {
  // Prepend Home if not explicitly present
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items.filter((i) => i.href !== '/'),
  ];

  // Generate Schema.org JSON-LD BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith('http') ? item.href : `https://eternal-paws.com${item.href}` } : {}),
    })),
  };

  return (
    <div className={`min-h-[28px] py-2 ${className}`}>
      {/* Schema.org Script Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual Accessible Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center">
        <ol className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-inkMuted">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1 || item.isCurrent;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 mx-1.5 text-inkSubtle flex-shrink-0 select-none"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-inkPrimary truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="hover:text-forestPrimary hover:underline transition-colors flex items-center gap-1 min-h-[36px] sm:min-h-[44px] px-1 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                  >
                    {index === 0 && showHomeIcon && (
                      <Home className="w-3.5 h-3.5 text-inkSubtle" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
