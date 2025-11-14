import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/shared/components/ui/Checkbox';

describe('Checkbox', () => {
  it('renders checkbox', () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('renders label', () => {
    const { getByText } = render(<Checkbox label="Accept terms" />);
    expect(getByText('Accept terms')).toBeInTheDocument();
  });

  it('calls onChange when checked', () => {
    const onChange = jest.fn();
    const { container } = render(<Checkbox label="Test" onChange={onChange} />);
    
    const checkbox = container.querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('can be disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<Checkbox label="Test" disabled onChange={onChange} />);
    
    const checkbox = container.querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);
    
    expect(onChange).not.toHaveBeenCalled();
  });
});

