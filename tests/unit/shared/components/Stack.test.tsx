import React from 'react';
import { render } from '@testing-library/react';
import { Stack, VStack, HStack } from '@/shared/components/layout/Stack';

describe('Stack', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
  });

  it('applies vertical direction by default', () => {
    const { container } = render(<Stack>Content</Stack>);

    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies horizontal direction', () => {
    const { container } = render(<Stack direction="horizontal">Content</Stack>);

    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('applies spacing classes for vertical stack', () => {
    const { container } = render(<Stack spacing="lg">Content</Stack>);

    expect(container.firstChild).toHaveClass('space-y-6');
  });

  it('applies spacing classes for horizontal stack', () => {
    const { container } = render(
      <Stack direction="horizontal" spacing="lg">
        Content
      </Stack>
    );

    expect(container.firstChild).toHaveClass('space-x-6');
  });

  it('applies align classes for vertical stack', () => {
    const { container } = render(<Stack align="center">Content</Stack>);

    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies align classes for horizontal stack', () => {
    const { container } = render(
      <Stack direction="horizontal" align="center">
        Content
      </Stack>
    );

    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('renders divider between items', () => {
    const { container } = render(
      <Stack divider={<hr />}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Stack>
    );

    const hrs = container.querySelectorAll('hr');
    expect(hrs).toHaveLength(2); // 2 dividers between 3 items
  });

  it('applies custom className', () => {
    const { container } = render(<Stack className="custom-class">Content</Stack>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('VStack', () => {
  it('renders as vertical stack', () => {
    const { container } = render(<VStack>Content</VStack>);

    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies spacing', () => {
    const { container } = render(<VStack spacing="lg">Content</VStack>);

    expect(container.firstChild).toHaveClass('space-y-6');
  });
});

describe('HStack', () => {
  it('renders as horizontal stack', () => {
    const { container } = render(<HStack>Content</HStack>);

    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('applies spacing', () => {
    const { container } = render(<HStack spacing="lg">Content</HStack>);

    expect(container.firstChild).toHaveClass('space-x-6');
  });
});

