import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Dropdown } from '@/shared/components/ui/Dropdown';

describe('Dropdown', () => {
  const items = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('renders trigger', () => {
    const { getByText } = render(
      <Dropdown items={items} trigger={<button>Open Menu</button>} />
    );

    expect(getByText('Open Menu')).toBeInTheDocument();
  });

  it('opens dropdown on trigger click', () => {
    const { getByText, queryByText } = render(
      <Dropdown items={items} trigger={<button>Open Menu</button>} />
    );

    expect(queryByText('Option 1')).not.toBeInTheDocument();

    const trigger = getByText('Open Menu');
    fireEvent.click(trigger);

    expect(getByText('Option 1')).toBeInTheDocument();
  });

  it('calls onSelect when item is clicked', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Dropdown
        items={items}
        trigger={<button>Open Menu</button>}
        onSelect={onSelect}
      />
    );

    const trigger = getByText('Open Menu');
    fireEvent.click(trigger);

    const option = getByText('Option 1');
    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('closes dropdown after selection', () => {
    const { getByText, queryByText } = render(
      <Dropdown items={items} trigger={<button>Open Menu</button>} />
    );

    fireEvent.click(getByText('Open Menu'));
    fireEvent.click(getByText('Option 1'));

    expect(queryByText('Option 1')).not.toBeInTheDocument();
  });
});

