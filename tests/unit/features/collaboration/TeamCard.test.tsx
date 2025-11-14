import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamCard, TeamMember } from '@/features/collaboration/components/TeamCard';

const mockMembers: TeamMember[] = [
  { id: '1', name: 'Alice', avatar: 'https://example.com/alice.jpg', role: 'Developer' },
  { id: '2', name: 'Bob', avatar: 'https://example.com/bob.jpg', role: 'Designer' },
  { id: '3', name: 'Charlie', avatar: 'https://example.com/charlie.jpg', role: 'Manager' },
];

describe('TeamCard', () => {
  const defaultProps = {
    name: 'Development Team',
    members: mockMembers,
    memberCount: 3,
  };

  it('renders team name', () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText('Development Team')).toBeInTheDocument();
  });

  it('renders team description', () => {
    render(
      <TeamCard {...defaultProps} description="A team of developers" />
    );
    expect(screen.getByText('A team of developers')).toBeInTheDocument();
  });

  it('shows private badge when private', () => {
    render(<TeamCard {...defaultProps} isPrivate />);
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('displays member count', () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText('3 members')).toBeInTheDocument();
  });

  it('displays singular member text for one member', () => {
    render(<TeamCard {...defaultProps} memberCount={1} members={[mockMembers[0]]} />);
    expect(screen.getByText('1 member')).toBeInTheDocument();
  });

  it('shows remaining member count when more than 3 members', () => {
    render(<TeamCard {...defaultProps} memberCount={10} />);
    expect(screen.getByText('+7')).toBeInTheDocument();
  });

  it('renders View Team button when onView provided', () => {
    const onView = jest.fn();
    render(<TeamCard {...defaultProps} onView={onView} />);
    expect(screen.getByText('View Team')).toBeInTheDocument();
  });

  it('calls onView when View Team button clicked', () => {
    const onView = jest.fn();
    render(<TeamCard {...defaultProps} onView={onView} />);

    const button = screen.getByText('View Team');
    fireEvent.click(button);

    expect(onView).toHaveBeenCalled();
  });

  it('renders Join Team button when onJoin provided', () => {
    const onJoin = jest.fn();
    render(<TeamCard {...defaultProps} onJoin={onJoin} />);
    expect(screen.getByText('Join Team')).toBeInTheDocument();
  });

  it('calls onJoin when Join Team button clicked', () => {
    const onJoin = jest.fn();
    render(<TeamCard {...defaultProps} onJoin={onJoin} />);

    const button = screen.getByText('Join Team');
    fireEvent.click(button);

    expect(onJoin).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TeamCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

