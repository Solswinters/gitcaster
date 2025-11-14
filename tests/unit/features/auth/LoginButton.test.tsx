import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginButton } from '@/features/auth/components/LoginButton';

describe('LoginButton', () => {
  it('renders sign in text', () => {
    render(<LoginButton onLogin={jest.fn()} />);
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('calls onLogin when clicked', () => {
    const onLogin = jest.fn();
    render(<LoginButton onLogin={onLogin} />);

    const button = screen.getByText('Sign in with GitHub');
    fireEvent.click(button);

    expect(onLogin).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<LoginButton onLogin={jest.fn()} loading />);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LoginButton onLogin={jest.fn()} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

