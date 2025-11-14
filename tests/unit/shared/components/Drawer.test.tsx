import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '@/shared/components/overlays/Drawer';

// Mock hooks
jest.mock('@/shared/hooks', () => ({
  useKeyPress: jest.fn(),
}));

describe('Drawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Drawer Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(<Drawer {...defaultProps} />);
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Drawer {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Drawer {...defaultProps} title="Test Drawer" />);
    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(<Drawer {...defaultProps} />);
    expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Drawer {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close drawer');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<Drawer {...defaultProps} onClose={onClose} />);

    const backdrop = container.querySelector('.bg-black.bg-opacity-50');
    fireEvent.click(backdrop!);

    expect(onClose).toHaveBeenCalled();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Drawer {...defaultProps} showCloseButton={false} />);
    expect(screen.queryByLabelText('Close drawer')).not.toBeInTheDocument();
  });
});

