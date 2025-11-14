import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar, SidebarItem } from '@/shared/components/navigation/Sidebar';

const mockItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings', badge: '3' },
  {
    label: 'Projects',
    href: '/projects',
    children: [
      { label: 'Active', href: '/projects/active' },
      { label: 'Archived', href: '/projects/archived' },
    ],
  },
];

describe('Sidebar', () => {
  it('renders sidebar items', () => {
    render(<Sidebar items={mockItems} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders badges', () => {
    render(<Sidebar items={mockItems} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('expands nested items when clicked', () => {
    render(<Sidebar items={mockItems} />);

    expect(screen.queryByText('Active')).not.toBeInTheDocument();

    const projectsItem = screen.getByText('Projects').closest('div');
    const expandButton = projectsItem?.querySelector('button');
    fireEvent.click(expandButton!);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('collapses nested items when clicked again', () => {
    render(<Sidebar items={mockItems} />);

    const projectsItem = screen.getByText('Projects').closest('div');
    const expandButton = projectsItem?.querySelector('button');

    // Expand
    fireEvent.click(expandButton!);
    expect(screen.getByText('Active')).toBeInTheDocument();

    // Collapse
    fireEvent.click(expandButton!);
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('handles collapse state', () => {
    const { rerender } = render(<Sidebar items={mockItems} collapsed={false} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();

    rerender(<Sidebar items={mockItems} collapsed={true} />);

    // Text should still be rendered but hidden by width
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('calls onCollapse when toggle clicked', () => {
    const handleCollapse = jest.fn();
    render(<Sidebar items={mockItems} collapsed={false} onCollapse={handleCollapse} />);

    const toggleButton = screen.getByLabelText('Collapse sidebar');
    fireEvent.click(toggleButton);

    expect(handleCollapse).toHaveBeenCalledWith(true);
  });

  it('renders icons with items', () => {
    const itemsWithIcons: SidebarItem[] = [
      { label: 'Home', href: '/', icon: <svg data-testid="home-icon" /> },
    ];

    render(<Sidebar items={itemsWithIcons} />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });
});

