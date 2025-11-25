import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { Banner } from '@/shared/components/feedback/Banner';

describe('Banner', () => {
  it('renders children', () => {
    const { getByText } = render(<Banner>Banner message</Banner>);

    expect(getByText('Banner message')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Banner variant="success">Message</Banner>);

    expect(container.firstChild).toHaveClass('bg-green-50');
    expect(container.firstChild).toHaveClass('border-green-200');
    expect(container.firstChild).toHaveClass('text-green-900');
  });

  it('renders action button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Banner action={{ label: 'Learn More', onClick }}>Message</Banner>
    );

    const button = getByText('Learn More');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders dismiss button when dismissible', () => {
    const { getByLabelText } = render(<Banner dismissible>Message</Banner>);

    expect(getByLabelText('Dismiss banner')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <Banner dismissible onDismiss={onDismiss}>
        Message
      </Banner>
    );

    const dismissButton = getByLabelText('Dismiss banner');
    fireEvent.click(dismissButton);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('hides banner after dismissal', () => {
    const { getByLabelText, queryByText } = render(
      <Banner dismissible>Message</Banner>
    );

    expect(queryByText('Message')).toBeInTheDocument();

    const dismissButton = getByLabelText('Dismiss banner');
    fireEvent.click(dismissButton);

    expect(queryByText('Message')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Banner className="custom-class">Message</Banner>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

