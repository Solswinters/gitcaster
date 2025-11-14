import React from 'react';
import { render, screen } from '@testing-library/react';
import { Widget } from '@/shared/components/widgets/Widget';

describe('Widget', () => {
  const defaultProps = {
    title: 'Test Widget',
    children: <div>Widget Content</div>,
  };

  it('renders widget title', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
  });

  it('renders widget content', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByText('Widget Content')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Widget {...defaultProps} description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button data-testid="action-btn">Action</button>;
    render(<Widget {...defaultProps} actions={actions} />);
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Widget {...defaultProps} loading />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Widget Content')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Widget {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Widget Content')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Widget {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

