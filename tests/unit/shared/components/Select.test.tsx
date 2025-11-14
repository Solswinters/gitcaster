import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from '@/shared/components/ui/Select';

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('renders select with options', () => {
    const { container } = render(<Select options={options} />);
    const select = container.querySelector('select');
    
    expect(select).toBeInTheDocument();
    expect(select?.options.length).toBe(3);
  });

  it('calls onChange when value changes', () => {
    const onChange = jest.fn();
    const { container } = render(<Select options={options} onChange={onChange} />);
    
    const select = container.querySelector('select')!;
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('can be disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<Select options={options} disabled onChange={onChange} />);
    
    const select = container.querySelector('select')!;
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows placeholder', () => {
    const { container } = render(
      <Select options={options} placeholder="Select an option" />
    );
    
    const select = container.querySelector('select')!;
    expect(select.options[0].text).toBe('Select an option');
  });
});

