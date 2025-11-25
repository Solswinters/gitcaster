import { render, screen, fireEvent } from '@testing-library/react';

import { Alert } from '@/shared/components/ui/Alert';

describe('Alert Component', () => {
  it('renders children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Alert title="Alert Title">Message</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('applies info variant by default', () => {
    const { container } = render(<Alert>Info message</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-blue-50');
  });

  it('applies success variant correctly', () => {
    const { container } = render(<Alert variant="success">Success message</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-green-50');
  });

  it('applies warning variant correctly', () => {
    const { container } = render(<Alert variant="warning">Warning message</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-yellow-50');
  });

  it('applies error variant correctly', () => {
    const { container } = render(<Alert variant="error">Error message</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-red-50');
  });

  it('displays default icon for each variant', () => {
    const { container } = render(<Alert variant="info">Info</Alert>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">🔔</span>;
    render(<Alert icon={customIcon}>Message</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('displays close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Message</Alert>);
    const closeButton = screen.getByLabelText('Close alert');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Message</Alert>);
    const closeButton = screen.getByLabelText('Close alert');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not display close button when onClose is not provided', () => {
    render(<Alert>Message</Alert>);
    const closeButton = screen.queryByLabelText('Close alert');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-alert">Message</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('custom-alert');
  });

  it('has correct ARIA role', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

