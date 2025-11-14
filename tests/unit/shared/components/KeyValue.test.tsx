import React from 'react';
import { render } from '@testing-library/react';
import { KeyValue, KeyValueCard } from '@/shared/components/data-display/KeyValue';

describe('KeyValue', () => {
  const pairs = [
    { key: 'Name', value: 'John Doe' },
    { key: 'Email', value: 'john@example.com' },
  ];

  it('renders all key-value pairs', () => {
    const { getByText } = render(<KeyValue pairs={pairs} />);

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders vertical layout by default', () => {
    const { container } = render(<KeyValue pairs={pairs} />);

    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('renders grid layout', () => {
    const { container } = render(<KeyValue pairs={pairs} layout="grid" />);

    expect(container.firstChild).toHaveClass('grid');
    expect(container.firstChild).toHaveClass('grid-cols-2');
  });

  it('applies spacing classes', () => {
    const { container } = render(<KeyValue pairs={pairs} spacing="lg" />);

    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('renders icons when provided', () => {
    const pairsWithIcons = [
      { key: 'Name', value: 'John', icon: <span data-testid="icon">👤</span> },
    ];

    const { getByTestId } = render(<KeyValue pairs={pairsWithIcons} />);

    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('renders dividers between items when enabled', () => {
    const { container } = render(<KeyValue pairs={pairs} divider />);

    const dividers = container.querySelectorAll('.border-b');
    expect(dividers).toHaveLength(1); // 1 divider between 2 items
  });

  it('applies custom className', () => {
    const { container } = render(
      <KeyValue pairs={pairs} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('KeyValueCard', () => {
  const pairs = [
    { key: 'Name', value: 'John Doe' },
    { key: 'Email', value: 'john@example.com' },
  ];

  it('renders key-value pairs in a card', () => {
    const { getByText } = render(<KeyValueCard pairs={pairs} />);

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    const { getByText } = render(
      <KeyValueCard title="User Information" pairs={pairs} />
    );

    expect(getByText('User Information')).toBeInTheDocument();
  });

  it('applies card styling', () => {
    const { container } = render(<KeyValueCard pairs={pairs} />);

    const card = container.firstChild;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
  });

  it('applies custom className', () => {
    const { container } = render(
      <KeyValueCard pairs={pairs} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

