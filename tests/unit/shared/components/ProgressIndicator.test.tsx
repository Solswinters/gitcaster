import React from 'react';
import { render } from '@testing-library/react';
import {
  ProgressBar,
  ProgressCircle,
  ProgressSteps,
} from '@/shared/components/feedback/ProgressIndicator';

describe('ProgressBar', () => {
  it('renders progress bar', () => {
    const { container } = render(<ProgressBar value={50} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('calculates correct percentage', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('shows label when showLabel is true', () => {
    const { getByText } = render(<ProgressBar value={50} showLabel />);

    expect(getByText('50%')).toBeInTheDocument();
  });

  it('shows custom label', () => {
    const { getByText } = render(
      <ProgressBar value={50} showLabel label="Loading..." />
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('applies variant colors', () => {
    const { container } = render(<ProgressBar value={50} variant="success" />);

    const progressBar = container.querySelector('.bg-green-600');
    expect(progressBar).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<ProgressBar value={50} size="lg" />);

    const wrapper = container.querySelector('.h-4');
    expect(wrapper).toBeInTheDocument();
  });

  it('caps percentage at 100%', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });
});

describe('ProgressCircle', () => {
  it('renders progress circle', () => {
    const { container } = render(<ProgressCircle value={50} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows percentage label by default', () => {
    const { getByText } = render(<ProgressCircle value={50} />);

    expect(getByText('50%')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    const { queryByText } = render(<ProgressCircle value={50} showLabel={false} />);

    expect(queryByText('50%')).not.toBeInTheDocument();
  });

  it('renders circles with correct size', () => {
    const { container } = render(<ProgressCircle value={50} size={100} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '100');
  });
});

describe('ProgressSteps', () => {
  const steps = [
    { label: 'Step 1', status: 'completed' as const },
    { label: 'Step 2', status: 'current' as const },
    { label: 'Step 3', status: 'pending' as const },
  ];

  it('renders all steps', () => {
    const { getByText } = render(<ProgressSteps steps={steps} />);

    expect(getByText('Step 1')).toBeInTheDocument();
    expect(getByText('Step 2')).toBeInTheDocument();
    expect(getByText('Step 3')).toBeInTheDocument();
  });

  it('shows step descriptions when provided', () => {
    const stepsWithDesc = [
      { label: 'Step 1', description: 'First step', status: 'completed' as const },
    ];

    const { getByText } = render(<ProgressSteps steps={stepsWithDesc} />);

    expect(getByText('First step')).toBeInTheDocument();
  });

  it('renders horizontal orientation by default', () => {
    const { container } = render(<ProgressSteps steps={steps} />);

    const wrapper = container.querySelector('.items-center.justify-between');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders vertical orientation', () => {
    const { container } = render(
      <ProgressSteps steps={steps} orientation="vertical" />
    );

    const wrapper = container.querySelector('.flex-col');
    expect(wrapper).toBeInTheDocument();
  });

  it('shows completed icon', () => {
    const completedSteps = [{ label: 'Done', status: 'completed' as const }];
    const { getByText } = render(<ProgressSteps steps={completedSteps} />);

    expect(getByText('✓')).toBeInTheDocument();
  });

  it('shows error icon', () => {
    const errorSteps = [{ label: 'Failed', status: 'error' as const }];
    const { getByText } = render(<ProgressSteps steps={errorSteps} />);

    expect(getByText('✕')).toBeInTheDocument();
  });
});

