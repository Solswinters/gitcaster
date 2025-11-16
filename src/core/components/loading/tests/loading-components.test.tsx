/**
 * Tests for loading components
 */

import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';
import { LoadingOverlay } from '../LoadingOverlay';
import { SkeletonLoader } from '../SkeletonLoader';
import { PageLoader } from '../PageLoader';
import { LoadingButton } from '../LoadingButton';
import { SuspenseFallback } from '../SuspenseFallback';

describe('Loading Components', () => {
  describe('Spinner', () => {
    it('renders with default size', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('LoadingOverlay', () => {
    it('renders with default message', () => {
      render(<LoadingOverlay />);
      const overlay = screen.getByRole('alert');
      expect(overlay).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      const message = 'Loading data...';
      render(<LoadingOverlay message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('renders fullscreen overlay', () => {
      const { container } = render(<LoadingOverlay fullScreen={true} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('fixed');
    });
  });

  describe('SkeletonLoader', () => {
    it('renders with default variant', () => {
      render(<SkeletonLoader />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with circular variant', () => {
      render(<SkeletonLoader variant="circular" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');
    });
  });

  describe('PageLoader', () => {
    it('renders with default message', () => {
      render(<PageLoader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      const message = 'Please wait...';
      render(<PageLoader message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  describe('LoadingButton', () => {
    it('renders children when not loading', () => {
      render(<LoadingButton>Click me</LoadingButton>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('shows spinner when loading', () => {
      render(<LoadingButton isLoading={true}>Click me</LoadingButton>);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<LoadingButton isLoading={true}>Click me</LoadingButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows loading text when provided', () => {
      render(
        <LoadingButton isLoading={true} loadingText="Loading...">
          Click me
        </LoadingButton>
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('SuspenseFallback', () => {
    it('renders with default message', () => {
      render(<SuspenseFallback />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      const message = 'Loading page...';
      render(<SuspenseFallback message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('renders fullscreen when specified', () => {
      const { container } = render(<SuspenseFallback fullScreen={true} />);
      const fallback = container.firstChild as HTMLElement;
      expect(fallback).toHaveClass('fixed');
    });
  });
});

