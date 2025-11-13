import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchFilters } from '@/components/search/SearchFilters';

describe('SearchFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should render filter options', () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText(/experience/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
  });

  it('should call onFilterChange when experience level is selected', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    const seniorCheckbox = screen.getByLabelText(/senior/i);
    fireEvent.click(seniorCheckbox);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceLevel: expect.arrayContaining(['senior']),
        })
      );
    });
  });

  it('should allow multiple experience levels to be selected', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    const seniorCheckbox = screen.getByLabelText(/senior/i);
    const midCheckbox = screen.getByLabelText(/mid/i);

    fireEvent.click(seniorCheckbox);
    fireEvent.click(midCheckbox);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceLevel: expect.arrayContaining(['senior', 'mid']),
        })
      );
    });
  });

  it('should update location filter', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    const locationInput = screen.getByPlaceholderText(/location/i);
    fireEvent.change(locationInput, { target: { value: 'San Francisco' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'San Francisco',
        })
      );
    });
  });

  it('should clear all filters', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    // Set some filters first
    const seniorCheckbox = screen.getByLabelText(/senior/i);
    fireEvent.click(seniorCheckbox);

    // Clear filters
    const clearButton = screen.getByText(/clear/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });
  });

  it('should show active filter count', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    const seniorCheckbox = screen.getByLabelText(/senior/i);
    const midCheckbox = screen.getByLabelText(/mid/i);

    fireEvent.click(seniorCheckbox);
    fireEvent.click(midCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/2 filters active/i)).toBeInTheDocument();
    });
  });

  it('should be accessible via keyboard', () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);

    const seniorCheckbox = screen.getByLabelText(/senior/i);
    
    seniorCheckbox.focus();
    expect(document.activeElement).toBe(seniorCheckbox);

    fireEvent.keyDown(seniorCheckbox, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnFilterChange).toHaveBeenCalled();
  });
});

