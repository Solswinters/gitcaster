import { render, screen, fireEvent } from '@testing-library/react';
import {
  ErrorDisplay,
  InlineError,
  ErrorBanner,
  ErrorCard,
  PageError,
} from '@/shared/components/error/ErrorDisplay';

describe('ErrorDisplay Component', () => {
  describe('Inline Variant', () => {
    it('renders inline error', () => {
      render(<ErrorDisplay message="Error message" variant="inline" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
      const handleClose = jest.fn();
      render(
        <ErrorDisplay
          message="Error"
          variant="inline"
          onClose={handleClose}
        />
      );
      const closeButton = screen.getByLabelText('Close alert');
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Alert Variant', () => {
    it('renders alert with message', () => {
      render(<ErrorDisplay message="Alert message" variant="alert" />);
      expect(screen.getByText('Alert message')).toBeInTheDocument();
    });

    it('renders alert with title', () => {
      render(
        <ErrorDisplay
          message="Alert message"
          title="Error Title"
          variant="alert"
        />
      );
      expect(screen.getByText('Error Title')).toBeInTheDocument();
    });

    it('shows details when provided', () => {
      render(
        <ErrorDisplay
          message="Error"
          details="Additional details"
          variant="alert"
        />
      );
      expect(screen.getByText('Additional details')).toBeInTheDocument();
    });

    it('shows retry button when onRetry provided', () => {
      const handleRetry = jest.fn();
      render(
        <ErrorDisplay
          message="Error"
          variant="alert"
          onRetry={handleRetry}
        />
      );
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Banner Variant', () => {
    it('renders banner error', () => {
      render(<ErrorDisplay message="Banner message" variant="banner" />);
      expect(screen.getByText('Banner message')).toBeInTheDocument();
    });

    it('shows details in banner', () => {
      render(
        <ErrorDisplay
          message="Error"
          details="Extra info"
          variant="banner"
        />
      );
      expect(screen.getByText('Extra info')).toBeInTheDocument();
    });

    it('applies correct styling for error severity', () => {
      const { container } = render(
        <ErrorDisplay message="Error" variant="banner" severity="error" />
      );
      expect(container.firstChild).toHaveClass('border-red-600');
    });

    it('applies correct styling for warning severity', () => {
      const { container } = render(
        <ErrorDisplay message="Warning" variant="banner" severity="warning" />
      );
      expect(container.firstChild).toHaveClass('border-yellow-600');
    });
  });

  describe('Card Variant', () => {
    it('renders card error', () => {
      render(<ErrorDisplay message="Card message" variant="card" />);
      expect(screen.getByText('Card message')).toBeInTheDocument();
    });

    it('shows retry and dismiss buttons', () => {
      const handleRetry = jest.fn();
      const handleClose = jest.fn();
      render(
        <ErrorDisplay
          message="Error"
          variant="card"
          onRetry={handleRetry}
          onClose={handleClose}
        />
      );
      
      const retryButton = screen.getByRole('button', { name: /try again/i });
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      
      expect(retryButton).toBeInTheDocument();
      expect(dismissButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
      
      fireEvent.click(dismissButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('centers content in card', () => {
      const { container } = render(
        <ErrorDisplay message="Error" variant="card" />
      );
      const centerDiv = container.querySelector('.items-center.text-center');
      expect(centerDiv).toBeInTheDocument();
    });
  });

  describe('Page Variant', () => {
    it('renders full page error', () => {
      render(<ErrorDisplay message="Page error" variant="page" />);
      expect(screen.getByText('Page error')).toBeInTheDocument();
    });

    it('displays large title', () => {
      render(
        <ErrorDisplay
          message="Error"
          title="404"
          variant="page"
        />
      );
      const title = screen.getByText('404');
      expect(title).toHaveClass('text-4xl');
    });

    it('shows both retry and go back buttons', () => {
      render(
        <ErrorDisplay
          message="Error"
          variant="page"
          onRetry={jest.fn()}
          onClose={jest.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });
  });

  describe('Convenience Components', () => {
    it('InlineError renders as inline variant', () => {
      render(<InlineError message="Inline error" />);
      expect(screen.getByText('Inline error')).toBeInTheDocument();
    });

    it('ErrorBanner renders as banner variant', () => {
      render(<ErrorBanner message="Banner error" />);
      expect(screen.getByText('Banner error')).toBeInTheDocument();
    });

    it('ErrorCard renders as card variant', () => {
      render(<ErrorCard message="Card error" />);
      expect(screen.getByText('Card error')).toBeInTheDocument();
    });

    it('PageError renders as page variant', () => {
      render(<PageError message="Page error" />);
      expect(screen.getByText('Page error')).toBeInTheDocument();
    });
  });

  describe('Severity Variants', () => {
    it('applies error severity by default', () => {
      const { container } = render(
        <ErrorDisplay message="Error" variant="alert" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-red-50');
    });

    it('applies warning severity when specified', () => {
      const { container } = render(
        <ErrorDisplay message="Warning" variant="alert" severity="warning" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-yellow-50');
    });
  });

  describe('Custom Icon', () => {
    it('renders custom icon when provided', () => {
      const customIcon = <span data-testid="custom-icon">🚨</span>;
      render(
        <ErrorDisplay
          message="Error"
          variant="card"
          icon={customIcon}
        />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ErrorDisplay
          message="Error"
          variant="inline"
          className="custom-class"
        />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});

