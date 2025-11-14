import React from 'react';
import { render } from '@testing-library/react';
import { Section, SectionHeader } from '@/shared/components/layout/Section';

describe('Section', () => {
  it('renders children', () => {
    const { getByText } = render(<Section>Content</Section>);

    expect(getByText('Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Section variant="dark">Content</Section>);

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gray-900');
    expect(section).toHaveClass('text-white');
  });

  it('applies padding classes', () => {
    const { container } = render(<Section padding="lg">Content</Section>);

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-16');
  });

  it('renders with container by default', () => {
    const { container } = render(<Section>Content</Section>);

    expect(container.querySelector('.container')).toBeInTheDocument();
  });

  it('renders without container when contained is false', () => {
    const { container } = render(<Section contained={false}>Content</Section>);

    expect(container.querySelector('.container')).not.toBeInTheDocument();
  });

  it('applies full width class', () => {
    const { container } = render(<Section fullWidth>Content</Section>);

    const section = container.querySelector('section');
    expect(section).toHaveClass('w-full');
  });

  it('applies custom className', () => {
    const { container } = render(<Section className="custom-class">Content</Section>);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('applies id attribute', () => {
    const { container } = render(<Section id="test-section">Content</Section>);

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'test-section');
  });
});

describe('SectionHeader', () => {
  it('renders title', () => {
    const { getByText } = render(<SectionHeader title="Test Title" />);

    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <SectionHeader title="Title" subtitle="Subtitle" />
    );

    expect(getByText('Subtitle')).toBeInTheDocument();
  });

  it('applies align classes', () => {
    const { container } = render(<SectionHeader title="Title" align="center" />);

    expect(container.firstChild).toHaveClass('text-center');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SectionHeader title="Title" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

