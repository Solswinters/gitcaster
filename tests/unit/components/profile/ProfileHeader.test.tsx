import React from 'react'
import { render, screen } from '../../../utils/test-helpers'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { mockGitHubUser } from '../../../utils/mock-data'

describe('ProfileHeader Component', () => {
  const mockProfile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    githubUsername: 'testuser',
    githubData: mockGitHubUser,
  }

  it('should render user name', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(mockGitHubUser.name)).toBeInTheDocument()
  })

  it('should render username', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(`@${mockGitHubUser.login}`)).toBeInTheDocument()
  })

  it('should render user bio', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(mockGitHubUser.bio)).toBeInTheDocument()
  })

  it('should render user avatar', () => {
    render(<ProfileHeader profile={mockProfile} />)
    const avatar = screen.getByRole('img', { name: new RegExp(mockGitHubUser.name) })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', expect.stringContaining(mockGitHubUser.login))
  })

  it('should display location when available', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(mockGitHubUser.location)).toBeInTheDocument()
  })

  it('should display company when available', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(mockGitHubUser.company)).toBeInTheDocument()
  })

  it('should display follower count', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(new RegExp(mockGitHubUser.followers.toString()))).toBeInTheDocument()
  })

  it('should display repository count', () => {
    render(<ProfileHeader profile={mockProfile} />)
    expect(screen.getByText(new RegExp(mockGitHubUser.public_repos.toString()))).toBeInTheDocument()
  })

  it('should handle missing optional fields gracefully', () => {
    const profileWithoutOptionalFields = {
      ...mockProfile,
      githubData: {
        ...mockGitHubUser,
        company: null,
        location: null,
        bio: null,
      },
    }
    
    render(<ProfileHeader profile={profileWithoutOptionalFields} />)
    expect(screen.getByText(mockGitHubUser.name)).toBeInTheDocument()
  })

  it('should render GitHub profile link', () => {
    render(<ProfileHeader profile={mockProfile} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', `https://github.com/${mockGitHubUser.login}`)
  })
})

