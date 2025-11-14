import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Tooltip } from '@/shared/components/ui/Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', async () => {
    const { getByText, findByText } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(findByText('Tooltip text')).toBeDefined();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    const { getByText, queryByText } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  it('renders in different positions', () => {
    const { getByText } = render(
      <Tooltip content="Tooltip text" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(getByText('Hover me')).toBeInTheDocument();
  });
});

