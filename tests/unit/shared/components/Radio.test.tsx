import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Radio } from '@/shared/components/ui/Radio';

describe('Radio', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  it('renders radio buttons', () => {
    const { container } = render(<Radio name="test" options={options} />);
    const radios = container.querySelectorAll('input[type="radio"]');
    
    expect(radios.length).toBe(2);
  });

  it('renders labels', () => {
    const { getByText } = render(<Radio name="test" options={options} />);
    
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when selected', () => {
    const onChange = jest.fn();
    const { container } = render(<Radio name="test" options={options} onChange={onChange} />);
    
    const radio = container.querySelectorAll('input[type="radio"]')[1];
    fireEvent.click(radio);
    
    expect(onChange).toHaveBeenCalledWith('2');
  });
});

