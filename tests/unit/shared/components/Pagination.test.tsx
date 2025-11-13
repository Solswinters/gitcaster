import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/shared/components/ui/Pagination';

describe('Pagination', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  it('renders page numbers', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    const currentButton = screen.getByLabelText('Page 3');
    expect(currentButton).toHaveClass('bg-blue-600');
  });

  it('handles page change', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByText('3'));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('handles previous button', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByLabelText('Previous page'));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles next button', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByLabelText('Next page'));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('shows dots for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );

    const dots = screen.getAllByText('...');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('handles first/last buttons', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
        showFirstLast
      />
    );

    fireEvent.click(screen.getByLabelText('First page'));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText('Last page'));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('respects disabled state', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled
      />
    );

    fireEvent.click(screen.getByText('4'));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('controls sibling count', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
        siblingCount={2}
      />
    );

    // With siblingCount=2, should show more pages around current
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});

