import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SkipToContent from '@/components/layout/SkipToContent';
import { CATEGORY_NAV_ITEMS } from '@/components/layout/Header';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/reunions',
}));

describe('SkipToContent Component (F03, F05)', () => {
  it('should render skip link targeting #main-content', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveClass('sr-only');
  });
});

describe('Header Component (F05)', () => {
  it('should render brand logo with home link', () => {
    render(<Header />);
    const logoLink = screen.getByRole('link', { name: /eternal paws home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render all primary category navigation items', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /^reunions$/i })).toHaveAttribute('href', '/reunions');
    expect(screen.getByRole('link', { name: /^hero dogs$/i })).toHaveAttribute('href', '/hero-dogs');
    expect(screen.getByRole('link', { name: /^rescues$/i })).toHaveAttribute('href', '/rescues');
    expect(screen.getByRole('link', { name: /^survival$/i })).toHaveAttribute('href', '/survival');
    expect(screen.getByRole('link', { name: /^loyalty$/i })).toHaveAttribute('href', '/loyalty');
    expect(screen.getByRole('link', { name: /^lost & found$/i })).toHaveAttribute('href', '/lost-and-found');
  });

  it('should mark active category link with aria-current="page"', () => {
    render(<Header />);
    const activeLink = screen.getByRole('link', { name: /^reunions$/i });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('should render search trigger with accessible label', () => {
    render(<Header />);
    const searchLink = screen.getByRole('link', { name: /search stories/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');
  });

  it('should render mobile menu toggle button with initial aria-expanded="false"', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /open main navigation menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('MobileNav Component (F04, F05)', () => {
  const handleClose = vi.fn();

  beforeEach(() => {
    handleClose.mockClear();
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <MobileNav isOpen={false} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render dialog with aria-modal="true" when isOpen is true', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} currentPath="/reunions" />
    );
    const dialog = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    const closeButton = screen.getByRole('button', { name: /close navigation menu/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render category and trust links in drawer', () => {
    render(
      <MobileNav isOpen={true} onClose={handleClose} navItems={CATEGORY_NAV_ITEMS} />
    );
    expect(screen.getByRole('link', { name: /fact-checking policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /editorial policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /corrections center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about eternal paws/i })).toBeInTheDocument();
  });
});

describe('Footer Component (F05)', () => {
  it('should render landmark role="contentinfo"', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render newsletter subscription section with input and submit button', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /join the pack/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe free/i })).toBeInTheDocument();
  });

  it('should render AI disclosure notice', () => {
    render(<Footer />);
    expect(screen.getByText(/ai disclosure notice/i)).toBeInTheDocument();
    expect(screen.getByText(/never use generative ai to fabricate stories/i)).toBeInTheDocument();
  });

  it('should render trust links and copyright statement', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /fact-checking charter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /corrections & retractions log/i })).toBeInTheDocument();
    expect(screen.getByText(/eternal paws media/i)).toBeInTheDocument();
  });
});

describe('Breadcrumbs Component (F05)', () => {
  const items = [
    { label: 'Reunions', href: '/reunions' },
    { label: 'Max Finds His Way Home', isCurrent: true },
  ];

  it('should render nav landmark with aria-label="Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it('should render Home root link and category parent link', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /reunions/i })).toHaveAttribute('href', '/reunions');
  });

  it('should mark current item with aria-current="page" and not render it as link', () => {
    render(<Breadcrumbs items={items} />);
    const currentItem = screen.getByText('Max Finds His Way Home');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
    expect(currentItem.closest('a')).toBeNull();
  });

  it('should embed valid Schema.org BreadcrumbList JSON-LD script', () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent || '{}');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement).toHaveLength(3); // Home + Reunions + Current
    expect(data.itemListElement[0].name).toBe('Home');
  });
});
