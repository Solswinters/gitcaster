import React from 'react';
import { render } from '@testing-library/react';
import { Timeline, TimelineVertical, TimelineAlternate } from '@/shared/components/data-display/Timeline';

describe('Timeline', () => {
  const items = [
    {
      id: '1',
      title: 'Event 1',
      description: 'Description 1',
      timestamp: '2024-01-01',
    },
    {
      id: '2',
      title: 'Event 2',
      description: 'Description 2',
      timestamp: '2024-01-02',
    },
  ];

  it('renders all timeline items', () => {
    const { getByText } = render(<Timeline items={items} />);

    expect(getByText('Event 1')).toBeInTheDocument();
    expect(getByText('Description 1')).toBeInTheDocument();
    expect(getByText('2024-01-01')).toBeInTheDocument();
    expect(getByText('Event 2')).toBeInTheDocument();
  });

  it('renders with left variant by default', () => {
    const { container } = render(<Timeline items={items} />);

    const timelineItems = container.querySelectorAll('.pl-12');
    expect(timelineItems.length).toBeGreaterThan(0);
  });

  it('renders with right variant', () => {
    const { container } = render(<Timeline items={items} variant="right" />);

    const timelineItems = container.querySelectorAll('.pr-12');
    expect(timelineItems.length).toBeGreaterThan(0);
  });

  it('renders timeline line', () => {
    const { container } = render(<Timeline items={items} />);

    const line = container.querySelector('.bg-gray-200');
    expect(line).toBeInTheDocument();
  });

  it('renders status colors', () => {
    const itemsWithStatus = [
      { ...items[0], status: 'success' as const },
      { ...items[1], status: 'error' as const },
    ];

    const { container } = render(<Timeline items={itemsWithStatus} />);

    const successDot = container.querySelector('.bg-green-500');
    const errorDot = container.querySelector('.bg-red-500');

    expect(successDot).toBeInTheDocument();
    expect(errorDot).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    const itemsWithIcons = [
      { ...items[0], icon: <span data-testid="icon">✓</span> },
    ];

    const { getByTestId } = render(<Timeline items={itemsWithIcons} />);

    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Timeline items={items} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('TimelineVertical', () => {
  const items = [
    {
      id: '1',
      title: 'Event 1',
      timestamp: '2024-01-01',
    },
  ];

  it('renders vertical timeline', () => {
    const { getByText } = render(<TimelineVertical items={items} />);

    expect(getByText('Event 1')).toBeInTheDocument();
  });
});

describe('TimelineAlternate', () => {
  const items = [
    {
      id: '1',
      title: 'Event 1',
      timestamp: '2024-01-01',
    },
    {
      id: '2',
      title: 'Event 2',
      timestamp: '2024-01-02',
    },
  ];

  it('renders alternating timeline', () => {
    const { getByText } = render(<TimelineAlternate items={items} />);

    expect(getByText('Event 1')).toBeInTheDocument();
    expect(getByText('Event 2')).toBeInTheDocument();
  });
});

