import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Input,
  Textarea,
  Accordion,
  Skeleton,
  Container,
} from '@/design-system';

describe('Base UI Primitives Behavior & Accessibility (F02, F03, F04)', () => {
  describe('Button Component', () => {
    it('should render children and enforce min 44px touch target classes', () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button.className).toContain('min-h-[44px]');
      expect(button.className).toContain('min-w-[44px]');
    });

    it('should render loading state with spinner and aria-busy="true"', () => {
      render(<Button isLoading>Submitting</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });

    it('should render as a link when href is provided', () => {
      render(<Button href="/stories/max-hero">Read Story</Button>);
      const link = screen.getByRole('link', { name: /read story/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/stories/max-hero');
    });

    it('should support variants (gold, secondary, outline, ghost)', () => {
      const { rerender } = render(<Button variant="gold">Gold CTA</Button>);
      expect(screen.getByRole('button').className).toContain('bg-goldAccent');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button').className).toContain('bg-forestLight');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button').className).toContain('border-borderLight');
    });
  });

  describe('Badge Component', () => {
    it('should render badge text and support status variants', () => {
      render(<Badge variant="verified">Verified Story</Badge>);
      const badge = screen.getByText('Verified Story');
      expect(badge).toBeInTheDocument();
    });

    it('should render indicator dot when dot prop is true', () => {
      const { container } = render(<Badge variant="verified" dot>Verified</Badge>);
      const dot = container.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('Card Component', () => {
    it('should render compound card components with semantic tags', () => {
      render(
        <Card as="article" variant="elevated">
          <CardHeader>
            <CardTitle as="h2">Dog Hero Award</CardTitle>
            <CardDescription>Story of courage and rescue</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content text</p>
          </CardContent>
          <CardFooter>
            <span>Read more</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /dog hero award/i })).toBeInTheDocument();
      expect(screen.getByText(/story of courage/i)).toBeInTheDocument();
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });
  });

  describe('Modal Component', () => {
    it('should render dialog when isOpen is true and handle close', () => {
      const handleClose = vi.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={handleClose} title="Verification Details" description="Source record metadata">
          <p>Dialog body content</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog', { name: /verification details/i });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByText('Dialog body content')).toBeInTheDocument();

      // Click close button
      const closeBtn = screen.getByRole('button', { name: /close dialog/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);

      // Does not render when isOpen is false
      rerender(
        <Modal isOpen={false} onClose={handleClose} title="Verification Details">
          <p>Dialog body content</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should call onClose when ESC key is pressed', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Test</p>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input & Textarea Components', () => {
    it('should render input with label linkage and error message', () => {
      render(
        <Input
          id="dog-name"
          label="Dog Name"
          error="Dog name is required"
          required
        />
      );

      const input = screen.getByLabelText(/dog name/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.className).toContain('min-h-[44px]');
      expect(screen.getByRole('alert')).toHaveTextContent('Dog name is required');
    });

    it('should render textarea with helper text and accessible linkage', () => {
      render(
        <Textarea
          id="story-excerpt"
          label="Story Excerpt"
          helperText="Write a 2-3 sentence summary"
        />
      );

      const textarea = screen.getByLabelText(/story excerpt/i);
      expect(textarea).toBeInTheDocument();
      expect(screen.getByText(/write a 2-3 sentence summary/i)).toBeInTheDocument();
    });
  });

  describe('Accordion Component', () => {
    const items = [
      { id: '1', title: 'What is 4-tier verification?', content: 'Our verification rubric...' },
      { id: '2', title: 'How are photos sourced?', content: 'All photos are checked...' },
    ];

    it('should render accordion items with correct ARIA attributes and toggle content', () => {
      render(<Accordion items={items} />);

      const firstButton = screen.getByRole('button', { name: /what is 4-tier verification\?/i });
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/our verification rubric\.\.\./i)).toBeVisible();

      // Click again to close
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Skeleton Component', () => {
    it('should render with aria-hidden="true" and animation class', () => {
      const { container } = render(<Skeleton variant="rectangular" width={300} height={200} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton.className).toContain('animate-pulse');
      expect(skeleton.style.width).toBe('300px');
      expect(skeleton.style.height).toBe('200px');
    });
  });

  describe('Container Component', () => {
    it('should render responsive container with preset max-width classes', () => {
      const { container, rerender } = render(<Container size="reading">Editorial article</Container>);
      expect(container.firstChild).toHaveClass('max-w-3xl');

      rerender(<Container size="wide">Wide header banner</Container>);
      expect(container.firstChild).toHaveClass('max-w-7xl');
    });
  });
});
