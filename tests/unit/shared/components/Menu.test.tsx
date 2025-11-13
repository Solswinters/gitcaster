import { render, screen, fireEvent } from '@testing-library/react';
import { Menu, type MenuItem } from '@/shared/components/ui/Menu';

const mockItems: MenuItem[] = [
  { key: '1', label: 'Edit', onClick: jest.fn() },
  { key: '2', label: 'Delete', onClick: jest.fn(), danger: true },
  { key: '3', label: 'Disabled', onClick: jest.fn(), disabled: true },
];

describe('Menu', () => {
  beforeEach(() => {
    mockItems.forEach((item) => (item.onClick as jest.Mock).mockClear());
  });

  it('renders trigger element', () => {
    render(
      <Menu items={mockItems}>
        <button>Actions</button>
      </Menu>
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('shows menu on click', () => {
    render(
      <Menu items={mockItems} trigger="click">
        <button>Actions</button>
      </Menu>
    );

    fireEvent.click(screen.getByText('Actions'));

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('handles item click', () => {
    render(
      <Menu items={mockItems} trigger="click">
        <button>Actions</button>
      </Menu>
    );

    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Edit'));

    expect(mockItems[0].onClick).toHaveBeenCalled();
  });

  it('closes menu after item click', () => {
    render(
      <Menu items={mockItems} trigger="click">
        <button>Actions</button>
      </Menu>
    );

    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('Edit'));

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('disables disabled items', () => {
    render(
      <Menu items={mockItems} trigger="click">
        <button>Actions</button>
      </Menu>
    );

    fireEvent.click(screen.getByText('Actions'));

    const disabledItem = screen.getByText('Disabled').closest('button');
    expect(disabledItem).toBeDisabled();
  });

  it('applies danger style', () => {
    render(
      <Menu items={mockItems} trigger="click">
        <button>Actions</button>
      </Menu>
    );

    fireEvent.click(screen.getByText('Actions'));

    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).toHaveClass('text-red-600');
  });
});

