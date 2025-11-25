import React from 'react'
import { Spinner } from '@/components/ui/spinner'
import { render, screen } from '../../../utils/test-helpers'

describe('Spinner Component', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have aria-label for accessibility', () => {
    render(<Spinner aria-label="Loading content" />)
    const spinner = screen.getByLabelText('Loading content')
    expect(spinner).toBeInTheDocument()
  })

  it('should accept size prop', () => {
    const { rerender } = render(<Spinner size="sm" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    
    rerender(<Spinner size="lg" />)
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('should have default accessibility attributes', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('[role="status"]')
    expect(spinner).toBeInTheDocument()
  })

  it('should support custom className', () => {
    const customClass = 'custom-spinner-class'
    const { container } = render(<Spinner className={customClass} />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.classList.contains(customClass)).toBe(true)
  })
})

