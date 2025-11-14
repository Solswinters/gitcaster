import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tabs } from '@/shared/components/ui/Tabs';

describe('Tabs', () => {
  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  ];

  it('renders all tab labels', () => {
    const { getByText } = render(<Tabs tabs={tabs} />);
    
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    const { getByText } = render(<Tabs tabs={tabs} />);
    expect(getByText('Content 1')).toBeInTheDocument();
  });

  it('switches tab on click', () => {
    const { getByText } = render(<Tabs tabs={tabs} />);
    
    fireEvent.click(getByText('Tab 2'));
    expect(getByText('Content 2')).toBeInTheDocument();
  });

  it('calls onChange when tab changes', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Tabs tabs={tabs} onChange={onChange} />);
    
    fireEvent.click(getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });
});

