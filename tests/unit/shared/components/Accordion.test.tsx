import { render, screen, fireEvent } from '@testing-library/react';

import { Accordion, type AccordionItem } from '@/shared/components/ui/Accordion';

const mockItems: AccordionItem[] = [
  { key: '1', title: 'Section 1', content: 'Content 1' },
  { key: '2', title: 'Section 2', content: 'Content 2' },
  { key: '3', title: 'Section 3', content: 'Content 3', disabled: true },
];

describe('Accordion', () => {
  it('renders all items', () => {
    render(<Accordion items={mockItems} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('toggles item on click', () => {
    render(<Accordion items={mockItems} />);

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Section 1'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('closes item when clicked again', () => {
    render(<Accordion items={mockItems} />);

    fireEvent.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Section 1'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('allows multiple items open', () => {
    render(<Accordion items={mockItems} multiple />);

    fireEvent.click(screen.getByText('Section 1'));
    fireEvent.click(screen.getByText('Section 2'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('closes other items in single mode', () => {
    render(<Accordion items={mockItems} />);

    fireEvent.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Section 2'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('uses default open keys', () => {
    render(<Accordion items={mockItems} defaultOpenKeys={['1', '2']} multiple />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('handles controlled mode', () => {
    const onChange = jest.fn();

    render(
      <Accordion items={mockItems} openKeys={['1']} onChange={onChange} />
    );

    fireEvent.click(screen.getByText('Section 2'));

    expect(onChange).toHaveBeenCalledWith(['2']);
  });

  it('disables disabled items', () => {
    render(<Accordion items={mockItems} />);

    const disabledButton = screen.getByText('Section 3').closest('button');
    expect(disabledButton).toBeDisabled();

    fireEvent.click(disabledButton!);
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });
});

