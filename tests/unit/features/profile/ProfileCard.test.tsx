import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileCard } from '@/features/profile/components/ProfileCard';

describe('ProfileCard', () => {
  const defaultProps = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders user name', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders user email', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders avatar when provided', () => {
    render(<ProfileCard {...defaultProps} avatar="https://example.com/avatar.jpg" />);
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
  });

  it('renders bio when provided', () => {
    render(<ProfileCard {...defaultProps} bio="Software Developer" />);
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });

  it('renders stats when provided', () => {
    const stats = [
      { label: 'Followers', value: 100 },
      { label: 'Following', value: 50 },
    ];
    render(<ProfileCard {...defaultProps} stats={stats} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button data-testid="edit-btn">Edit</button>;
    render(<ProfileCard {...defaultProps} actions={actions} />);
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProfileCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

