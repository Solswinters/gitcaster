import React from 'react';
import { render } from '@testing-library/react';
import { Center } from '@/shared/components/layout/Center';

describe('Center', () => {
  it('renders children', () => {
    const { getByText } = render(<Center>Content</Center>);

    expect(getByText('Content')).toBeInTheDocument();
  });

  it('centers both axes by default', () => {
    const { container } = render(<Center>Content</Center>);

    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('centers horizontally only', () => {
    const { container } = render(<Center axis="horizontal">Content</Center>);

    expect(container.firstChild).toHaveClass('justify-center');
    expect(container.firstChild).not.toHaveClass('items-center');
  });

  it('centers vertically only', () => {
    const { container } = render(<Center axis="vertical">Content</Center>);

    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).not.toHaveClass('justify-center');
  });

  it('uses flex by default', () => {
    const { container } = render(<Center>Content</Center>);

    expect(container.firstChild).toHaveClass('flex');
  });

  it('uses inline-flex when inline prop is true', () => {
    const { container } = render(<Center inline>Content</Center>);

    expect(container.firstChild).toHaveClass('inline-flex');
    expect(container.firstChild).not.toHaveClass('flex');
  });

  it('applies custom className', () => {
    const { container } = render(<Center className="custom-class">Content</Center>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

