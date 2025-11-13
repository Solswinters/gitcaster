import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBar } from '@/components/search/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should call onSearch when user types', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'developer' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('developer');
    }, { timeout: 500 });
  });

  it('should debounce search input', async () => {
    jest.useFakeTimers();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    
    // Type quickly
    fireEvent.change(input, { target: { value: 'd' } });
    fireEvent.change(input, { target: { value: 'de' } });
    fireEvent.change(input, { target: { value: 'dev' } });

    // Should not have called yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast forward time
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('dev');
    });

    jest.useRealTimers();
  });

  it('should show search suggestions', async () => {
    const suggestions = ['JavaScript', 'TypeScript', 'Python'];
    render(<SearchBar onSearch={mockOnSearch} suggestions={suggestions} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'script' } });

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('should select suggestion on click', async () => {
    const suggestions = ['JavaScript', 'TypeScript'];
    render(<SearchBar onSearch={mockOnSearch} suggestions={suggestions} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Java' } });

    await waitFor(() => {
      const suggestion = screen.getByText('JavaScript');
      fireEvent.click(suggestion);
    });

    expect(mockOnSearch).toHaveBeenCalledWith('JavaScript');
  });

  it('should navigate suggestions with keyboard', async () => {
    const suggestions = ['JavaScript', 'TypeScript', 'Python'];
    render(<SearchBar onSearch={mockOnSearch} suggestions={suggestions} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'script' } });

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    // Arrow down to select first suggestion
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    
    // Enter to select
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('JavaScript');
  });

  it('should clear input on escape key', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(input.value).toBe('');
  });

  it('should show clear button when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    
    // Initially no clear button
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

    // Type something
    fireEvent.change(input, { target: { value: 'test' } });

    // Clear button should appear
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });
});

