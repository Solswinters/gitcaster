import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Switch } from '@/shared/components/ui/Switch';

describe('Switch', () => {
  it('renders switch', () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('toggles state on click', () => {
    const { container } = render(<Switch />);
    const switchEl = container.querySelector('[role="switch"]');
    
    fireEvent.click(switchEl!);
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    const { container } = render(<Switch onChange={onChange} />);
    
    const switchEl = container.querySelector('[role="switch"]');
    fireEvent.click(switchEl!);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('can be disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<Switch disabled onChange={onChange} />);
    
    const switchEl = container.querySelector('[role="switch"]');
    fireEvent.click(switchEl!);
    
    expect(onChange).not.toHaveBeenCalled();
  });
});

