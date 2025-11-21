/**
 * Button Component Tests - Unit tests for Button component
 * HIGH PRIORITY: Testing coverage for UI components
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render as button element by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Button className="custom-class">Test</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('primary');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('secondary');
    });

    it('should apply outline variant styles', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('outline');
    });

    it('should apply ghost variant styles', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('ghost');
    });

    it('should apply danger variant styles', () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('danger');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('sm');
    });

    it('should apply medium size styles', () => {
      const { container } = render(<Button size="md">Medium</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('md');
    });

    it('should apply large size styles', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('lg');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not trigger onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Events', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass event to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Full Width', () => {
    it('should apply full width styles', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.firstChild;
      expect(button).toHaveClass('full-width');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(<Button aria-label="Test Button">Test</Button>);
      expect(screen.getByLabelText('Test Button')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Icon Support', () => {
    it('should render with left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      render(
        <Button leftIcon={<LeftIcon />}>
          With Left Icon
        </Button>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      render(
        <Button rightIcon={<RightIcon />}>
          With Right Icon
        </Button>
      );

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });
});

