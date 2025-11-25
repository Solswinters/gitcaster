import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { ThemePicker } from '@/components/themes/ThemePicker';

const mockThemes = [
  { id: '1', name: 'Default', primaryColor: '#3b82f6' },
  { id: '2', name: 'Dark', primaryColor: '#1f2937' },
  { id: '3', name: 'Ocean', primaryColor: '#0ea5e9' },
];

describe('ThemePicker', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render theme options', () => {
    render(<ThemePicker themes={mockThemes} onSelect={mockOnSelect} />);

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
  });

  it('should call onSelect when theme is clicked', () => {
    render(<ThemePicker themes={mockThemes} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Dark'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockThemes[1]);
  });

  it('should highlight selected theme', () => {
    render(<ThemePicker themes={mockThemes} selected="2" onSelect={mockOnSelect} />);

    const darkTheme = screen.getByText('Dark').closest('div');
    expect(darkTheme).toHaveClass(/selected|active/i);
  });
});

