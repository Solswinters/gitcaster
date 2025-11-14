import React from 'react';
import { render } from '@testing-library/react';
import { Metric, MetricGroup } from '@/shared/components/data-display/Metric';

describe('Metric', () => {
  it('renders label and value', () => {
    const { getByText } = render(<Metric label="Total Users" value={1234} />);

    expect(getByText('Total Users')).toBeInTheDocument();
    expect(getByText('1,234')).toBeInTheDocument();
  });

  it('formats currency values', () => {
    const { getByText } = render(
      <Metric label="Revenue" value={1234.56} format="currency" />
    );

    expect(getByText('$1,234.56')).toBeInTheDocument();
  });

  it('formats percentage values', () => {
    const { getByText } = render(
      <Metric label="Growth" value={25} format="percentage" />
    );

    expect(getByText('25%')).toBeInTheDocument();
  });

  it('displays change value', () => {
    const { getByText } = render(
      <Metric label="Users" value={100} change={15} />
    );

    expect(getByText('+15%')).toBeInTheDocument();
  });

  it('displays negative change', () => {
    const { getByText } = render(
      <Metric label="Users" value={100} change={-10} />
    );

    expect(getByText('-10%')).toBeInTheDocument();
  });

  it('displays trend indicator for up', () => {
    const { getByText } = render(
      <Metric label="Users" value={100} trend="up" />
    );

    expect(getByText('↑')).toBeInTheDocument();
  });

  it('displays trend indicator for down', () => {
    const { getByText } = render(
      <Metric label="Users" value={100} trend="down" />
    );

    expect(getByText('↓')).toBeInTheDocument();
  });

  it('applies correct trend color for up', () => {
    const { container } = render(
      <Metric label="Users" value={100} trend="up" />
    );

    const trendElement = container.querySelector('.text-green-600');
    expect(trendElement).toBeInTheDocument();
  });

  it('applies correct trend color for down', () => {
    const { container } = render(
      <Metric label="Users" value={100} trend="down" />
    );

    const trendElement = container.querySelector('.text-red-600');
    expect(trendElement).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { getByTestId } = render(
      <Metric
        label="Users"
        value={100}
        icon={<span data-testid="icon">👤</span>}
      />
    );

    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Metric label="Users" value={100} className="custom-class" />
    );

    const metric = container.querySelector('.custom-class');
    expect(metric).toBeInTheDocument();
  });
});

describe('MetricGroup', () => {
  it('renders children', () => {
    const { getByText } = render(
      <MetricGroup>
        <Metric label="Metric 1" value={100} />
        <Metric label="Metric 2" value={200} />
      </MetricGroup>
    );

    expect(getByText('Metric 1')).toBeInTheDocument();
    expect(getByText('Metric 2')).toBeInTheDocument();
  });

  it('applies column classes', () => {
    const { container } = render(
      <MetricGroup columns={4}>
        <Metric label="Metric 1" value={100} />
      </MetricGroup>
    );

    expect(container.firstChild).toHaveClass('lg:grid-cols-4');
  });

  it('uses 3 columns by default', () => {
    const { container } = render(
      <MetricGroup>
        <Metric label="Metric 1" value={100} />
      </MetricGroup>
    );

    expect(container.firstChild).toHaveClass('lg:grid-cols-3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricGroup className="custom-class">
        <Metric label="Metric 1" value={100} />
      </MetricGroup>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

