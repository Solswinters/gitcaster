import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormErrorBoundary } from '@/shared/components/forms/FormErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Success</div>;
};

describe('FormErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={false} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Form Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <FormErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('resets error state when Try Again is clicked', () => {
    const { rerender } = render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Form Error')).toBeInTheDocument();

    const button = screen.getByText('Try Again');
    fireEvent.click(button);

    rerender(
      <FormErrorBoundary>
        <ThrowError shouldThrow={false} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const fallback = (error: Error) => <div>Custom Error: {error.message}</div>;

    render(
      <FormErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
  });
});

