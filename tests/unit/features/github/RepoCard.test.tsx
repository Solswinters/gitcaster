import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepoCard } from '@/features/github/components/RepoCard';

describe('RepoCard', () => {
  const defaultProps = {
    name: 'my-repo',
    description: 'A great repository',
    language: 'TypeScript',
    stars: 42,
    forks: 10,
    url: 'https://github.com/user/my-repo',
  };

  it('renders repository name', () => {
    render(<RepoCard {...defaultProps} />);
    expect(screen.getByText('my-repo')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<RepoCard {...defaultProps} />);
    expect(screen.getByText('A great repository')).toBeInTheDocument();
  });

  it('renders language', () => {
    render(<RepoCard {...defaultProps} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders stars count', () => {
    render(<RepoCard {...defaultProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders forks count', () => {
    render(<RepoCard {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows private badge when private', () => {
    render(<RepoCard {...defaultProps} isPrivate />);
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not show private badge when public', () => {
    render(<RepoCard {...defaultProps} isPrivate={false} />);
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('renders updated date', () => {
    render(<RepoCard {...defaultProps} updatedAt="2 days ago" />);
    expect(screen.getByText('Updated 2 days ago')).toBeInTheDocument();
  });

  it('opens URL in new tab when clicked', () => {
    const windowOpen = jest.spyOn(window, 'open').mockImplementation();
    render(<RepoCard {...defaultProps} />);

    const card = screen.getByText('my-repo').closest('div');
    fireEvent.click(card!);

    expect(windowOpen).toHaveBeenCalledWith(
      'https://github.com/user/my-repo',
      '_blank',
      'noopener,noreferrer'
    );

    windowOpen.mockRestore();
  });

  it('does not open URL when no URL provided', () => {
    const windowOpen = jest.spyOn(window, 'open').mockImplementation();
    render(<RepoCard {...defaultProps} url={undefined} />);

    const card = screen.getByText('my-repo').closest('div');
    fireEvent.click(card!);

    expect(windowOpen).not.toHaveBeenCalled();

    windowOpen.mockRestore();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RepoCard {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

