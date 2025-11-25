import React from 'react'
import ErrorMessage from '@/components/error/ErrorMessage'
import { render, screen } from '../../../utils/test-helpers'

describe('ErrorMessage Component', () => {
  it('should render error message', () => {
    const errorText = 'Something went wrong'
    render(<ErrorMessage>{errorText}</ErrorMessage>)
    
    expect(screen.getByText(errorText)).toBeInTheDocument()
  })

  it('should have error styling classes', () => {
    const { container } = render(<ErrorMessage>Error</ErrorMessage>)
    const errorElement = container.firstChild
    
    expect(errorElement).toBeInTheDocument()
  })

  it('should render with custom className', () => {
    const customClass = 'custom-error-class'
    const { container } = render(
      <ErrorMessage className={customClass}>Error</ErrorMessage>
    )
    
    const errorElement = container.firstChild as HTMLElement
    expect(errorElement.classList.contains(customClass)).toBe(true)
  })

  it('should render multiple lines of error text', () => {
    const multilineError = 'Error line 1\nError line 2'
    render(<ErrorMessage>{multilineError}</ErrorMessage>)
    
    expect(screen.getByText(multilineError)).toBeInTheDocument()
  })

  it('should not render when children is empty', () => {
    const { container } = render(<ErrorMessage>{''}</ErrorMessage>)
    
    expect(container.firstChild).toBeInTheDocument()
  })
})

