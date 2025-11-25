import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { SkillsShowcase } from '@/components/profile/SkillsShowcase';

const mockSkills = [
  { id: '1', name: 'JavaScript', proficiency: 90, category: 'language' },
  { id: '2', name: 'React', proficiency: 85, category: 'framework' },
  { id: '3', name: 'Docker', proficiency: 75, category: 'tool' },
];

describe('SkillsShowcase', () => {
  it('should render all skills', () => {
    render(<SkillsShowcase skills={mockSkills} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('should display proficiency levels', () => {
    render(<SkillsShowcase skills={mockSkills} />);

    expect(screen.getByText(/90%?/)).toBeInTheDocument();
    expect(screen.getByText(/85%?/)).toBeInTheDocument();
  });

  it('should group skills by category', () => {
    render(<SkillsShowcase skills={mockSkills} grouped />);

    expect(screen.getByText(/language/i)).toBeInTheDocument();
    expect(screen.getByText(/framework/i)).toBeInTheDocument();
  });
});

