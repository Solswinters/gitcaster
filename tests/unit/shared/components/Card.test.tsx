import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardHeader, CardBody, CardFooter } from '@/shared/components/ui/Card';

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white');
  });

  it('applies bordered variant', () => {
    const { container } = render(<Card variant="bordered">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('border border-gray-200');
  });

  it('applies elevated variant', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies correct padding sizes', () => {
    const { container, rerender } = render(<Card padding="sm">Content</Card>);
    expect(container.firstChild).toHaveClass('p-4');

    rerender(<Card padding="md">Content</Card>);
    expect(container.firstChild).toHaveClass('p-6');

    rerender(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('applies no padding when padding is none', () => {
    const { container } = render(<Card padding="none">Content</Card>);
    expect(container.firstChild).not.toHaveClass('p-4', 'p-6', 'p-8');
  });

  it('applies hover styles when hoverable', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-xl', 'cursor-pointer');
  });

  it('calls onClick when hoverable and clicked', () => {
    const handleClick = jest.fn();
    render(<Card hoverable onClick={handleClick}>Content</Card>);
    fireEvent.click(screen.getByText('Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});

describe('CardHeader Component', () => {
  it('renders title', () => {
    render(<CardHeader title="Card Title" />);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<CardHeader subtitle="Card Subtitle" />);
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders both title and subtitle', () => {
    render(<CardHeader title="Title" subtitle="Subtitle" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(<CardHeader>Custom Header Content</CardHeader>);
    expect(screen.getByText('Custom Header Content')).toBeInTheDocument();
  });
});

describe('CardBody Component', () => {
  it('renders children', () => {
    render(<CardBody>Body Content</CardBody>);
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardBody className="custom-body">Content</CardBody>);
    expect(container.firstChild).toHaveClass('custom-body');
  });
});

describe('CardFooter Component', () => {
  it('renders children', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies border top styling', () => {
    const { container } = render(<CardFooter>Content</CardFooter>);
    expect(container.firstChild).toHaveClass('border-t');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Content</CardFooter>);
    expect(container.firstChild).toHaveClass('custom-footer');
  });
});

