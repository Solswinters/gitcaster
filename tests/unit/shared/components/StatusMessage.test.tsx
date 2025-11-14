import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  StatusMessage,
  SuccessMessage,
  ErrorMessage,
  LoadingMessage,
} from '@/shared/components/feedback/StatusMessage';

describe('StatusMessage', () => {
  it('renders title', () => {
    const { getByText } = render(
      <StatusMessage title="Success" status="success" />
    );

    expect(getByText('Success')).toBeInTheDocument();
  });

  it('renders message when provided', () => {
    const { getByText } = render(
      <StatusMessage
        title="Success"
        message="Operation completed successfully"
        status="success"
      />
    );

    expect(getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('renders default icon for status', () => {
    const { getByText } = render(
      <StatusMessage title="Success" status="success" />
    );

    expect(getByText('✓')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const { getByTestId } = render(
      <StatusMessage
        title="Custom"
        status="info"
        icon={<span data-testid="custom-icon">🎉</span>}
      />
    );

    expect(getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <StatusMessage
        title="Error"
        status="error"
        action={{ label: 'Retry', onClick }}
      />
    );

    const button = getByText('Retry');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('applies status-specific styles', () => {
    const { container } = render(
      <StatusMessage title="Error" status="error" />
    );

    expect(container.firstChild).toHaveClass('bg-red-50');
    expect(container.firstChild).toHaveClass('border-red-200');
  });

  it('renders in full page mode', () => {
    const { container } = render(
      <StatusMessage title="Success" status="success" fullPage />
    );

    const wrapper = container.querySelector('.min-h-screen');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies loading animation', () => {
    const { container } = render(
      <StatusMessage title="Loading" status="loading" />
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusMessage title="Title" status="info" className="custom-class" />
    );

    const message = container.querySelector('.custom-class');
    expect(message).toBeInTheDocument();
  });
});

describe('SuccessMessage', () => {
  it('renders success status', () => {
    const { getByText } = render(<SuccessMessage title="Success!" />);

    expect(getByText('Success!')).toBeInTheDocument();
    expect(getByText('✓')).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('renders error status', () => {
    const { getByText } = render(<ErrorMessage title="Error occurred" />);

    expect(getByText('Error occurred')).toBeInTheDocument();
    expect(getByText('✕')).toBeInTheDocument();
  });
});

describe('LoadingMessage', () => {
  it('renders loading status', () => {
    const { getByText, container } = render(<LoadingMessage title="Loading..." />);

    expect(getByText('Loading...')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});

