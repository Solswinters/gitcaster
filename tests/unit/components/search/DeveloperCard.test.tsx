import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DeveloperCard } from '@/components/search/DeveloperCard';

const mockDeveloper = {
  id: '1',
  slug: 'john-doe',
  displayName: 'John Doe',
  bio: 'Full-stack developer with 5 years experience',
  location: 'San Francisco',
  experienceLevel: 'senior',
  yearsOfExperience: 5,
  talentScore: 85,
  avatarUrl: 'https://example.com/avatar.jpg',
  skills: [
    { id: '1', name: 'JavaScript', proficiency: 90 },
    { id: '2', name: 'React', proficiency: 85 },
    { id: '3', name: 'Node.js', proficiency: 80 },
  ],
  githubUsername: 'johndoe',
  totalCommits: 1500,
  publicRepos: 25,
};

describe('DeveloperCard', () => {
  it('should render developer information', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    expect(screen.getByText(/san francisco/i)).toBeInTheDocument();
  });

  it('should display experience level', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText(/senior/i)).toBeInTheDocument();
  });

  it('should show years of experience', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText(/5 years/i)).toBeInTheDocument();
  });

  it('should display talent score', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText(/85/)).toBeInTheDocument();
  });

  it('should show top skills', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should display GitHub stats', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    expect(screen.getByText(/1500/)).toBeInTheDocument(); // commits
    expect(screen.getByText(/25/)).toBeInTheDocument(); // repos
  });

  it('should show avatar image', () => {
    render(<DeveloperCard developer={mockDeveloper} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should be clickable and navigate to profile', () => {
    const { container } = render(<DeveloperCard developer={mockDeveloper} />);

    const link = container.querySelector('a[href="/profile/john-doe"]');
    expect(link).toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const minimalDeveloper = {
      ...mockDeveloper,
      location: undefined,
      talentScore: undefined,
      githubUsername: undefined,
    };

    render(<DeveloperCard developer={minimalDeveloper} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText(/san francisco/i)).not.toBeInTheDocument();
  });

  it('should truncate long bio', () => {
    const longBio = 'A'.repeat(200);
    const developerWithLongBio = {
      ...mockDeveloper,
      bio: longBio,
    };

    render(<DeveloperCard developer={developerWithLongBio} />);

    const bioElement = screen.getByText(/A{100,}/, { exact: false });
    expect(bioElement.textContent).toHaveLength(153); // 150 chars + "..."
  });

  it('should show featured badge for featured profiles', () => {
    const featuredDeveloper = {
      ...mockDeveloper,
      isFeatured: true,
    };

    render(<DeveloperCard developer={featuredDeveloper} />);

    expect(screen.getByText(/featured/i)).toBeInTheDocument();
  });
});

