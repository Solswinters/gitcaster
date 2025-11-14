import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar, SearchSuggestion } from '@/features/search/components/SearchBar';

jest.mock('@/shared/hooks', () => ({
  useDebounce: (value: string) => value,
  useClickOutside: jest.fn(),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', label: 'Result 1', type: 'user' },
    { id: '2', label: 'Result 2', type: 'repo' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Search repositories..." />);
    expect(screen.getByPlaceholderText('Search repositories...')).toBeInTheDocument();
  });

  it('calls onSearch when typing', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('shows suggestions when provided', () => {
    render(
      <SearchBar onSearch={mockOnSearch} suggestions={mockSuggestions} />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();
  });

  it('shows loading indicator', () => {
    render(<SearchBar onSearch={mockOnSearch} loading />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('calls onSuggestionSelect when suggestion clicked', () => {
    const mockOnSuggestionSelect = jest.fn();
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionSelect={mockOnSuggestionSelect}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    const suggestion = screen.getByText('Result 1');
    fireEvent.click(suggestion);

    expect(mockOnSuggestionSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('submits search on Enter key', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('displays suggestion types', () => {
    render(
      <SearchBar onSearch={mockOnSearch} suggestions={mockSuggestions} />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('repo')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new query' } });

    expect(input.value).toBe('new query');
  });
});

