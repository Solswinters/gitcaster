import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar, NavItem } from '@/shared/components/navigation/Navbar';

const mockItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

describe('Navbar', () => {
  it('renders navigation items', () => {
    render(<Navbar items={mockItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    const logo = <div data-testid="logo">Logo</div>;
    render(<Navbar items={mockItems} logo={logo} />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button data-testid="action-btn">Login</button>;
    render(<Navbar items={mockItems} actions={actions} />);

    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Navbar items={mockItems} />);

    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Mobile menu should be visible
    const mobileLinks = screen.getAllByText('Home');
    expect(mobileLinks.length).toBeGreaterThan(1);
  });

  it('closes mobile menu when link clicked', () => {
    render(<Navbar items={mockItems} />);

    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    const mobileLink = screen.getAllByText('Home')[1]; // Get mobile version
    fireEvent.click(mobileLink);

    // Menu should close (only desktop version visible)
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBe(1);
  });

  it('renders icons with items', () => {
    const itemsWithIcons: NavItem[] = [
      { label: 'Home', href: '/', icon: <svg data-testid="home-icon" /> },
    ];

    render(<Navbar items={itemsWithIcons} />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Navbar items={mockItems} className="custom-class" />
    );

    expect(container.firstChild?.firstChild).toHaveClass('custom-class');
  });
});

