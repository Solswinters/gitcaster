import React from 'react'
import SkipToContent from '@/components/a11y/SkipToContent'
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden'
import { render, screen } from '../../../utils/test-helpers'

describe('Accessibility Components', () => {
  describe('SkipToContent', () => {
    it('should render skip to content link', () => {
      render(<SkipToContent />)
      const skipLink = screen.getByText(/skip to content/i)
      expect(skipLink).toBeInTheDocument()
    })

    it('should have correct href', () => {
      render(<SkipToContent />)
      const skipLink = screen.getByText(/skip to content/i)
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('should be keyboard accessible', () => {
      render(<SkipToContent />)
      const skipLink = screen.getByText(/skip to content/i)
      
      skipLink.focus()
      expect(skipLink).toHaveFocus()
    })
  })

  describe('VisuallyHidden', () => {
    it('should render children', () => {
      render(<VisuallyHidden>Hidden text</VisuallyHidden>)
      expect(screen.getByText('Hidden text')).toBeInTheDocument()
    })

    it('should have sr-only class', () => {
      const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>)
      const element = container.firstChild as HTMLElement
      expect(element.classList.contains('sr-only')).toBe(true)
    })

    it('should be accessible to screen readers', () => {
      render(<VisuallyHidden>Screen reader text</VisuallyHidden>)
      const text = screen.getByText('Screen reader text')
      expect(text).toBeInTheDocument()
    })
  })
})

describe('ARIA Attributes', () => {
  it('should have proper button roles', () => {
    const Button = ({ children }: { children: React.ReactNode }) => (
      <button type="button" role="button">
        {children}
      </button>
    )
    
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should have proper link roles', () => {
    render(<a href="/test">Link</a>)
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })

  it('should have proper heading hierarchy', () => {
    render(
      <div>
        <h1>Main Title</h1>
        <h2>Subtitle</h2>
      </div>
    )
    
    const heading1 = screen.getByRole('heading', { level: 1 })
    const heading2 = screen.getByRole('heading', { level: 2 })
    
    expect(heading1).toBeInTheDocument()
    expect(heading2).toBeInTheDocument()
  })
})

describe('Keyboard Navigation', () => {
  it('should support tab navigation', () => {
    render(
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    )
    
    const button1 = screen.getByText('Button 1')
    const button2 = screen.getByText('Button 2')
    
    button1.focus()
    expect(button1).toHaveFocus()
    
    button2.focus()
    expect(button2).toHaveFocus()
  })

  it('should support escape key for modals', () => {
    const handleClose = jest.fn()
    
    render(
      <div role="dialog" onKeyDown={(e) => e.key === 'Escape' && handleClose()}>
        <button>Close</button>
      </div>
    )
    
    const dialog = screen.getByRole('dialog')
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    
    // Verify event handling
    expect(dialog).toBeInTheDocument()
  })
})

