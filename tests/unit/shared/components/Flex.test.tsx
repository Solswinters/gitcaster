import React from 'react';
import { render } from '@testing-library/react';
import { Flex, FlexItem } from '@/shared/components/layout/Flex';

describe('Flex', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Flex>
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    );

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
  });

  it('applies direction classes', () => {
    const { container } = render(<Flex direction="col">Content</Flex>);

    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies align classes', () => {
    const { container } = render(<Flex align="center">Content</Flex>);

    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies justify classes', () => {
    const { container } = render(<Flex justify="between">Content</Flex>);

    expect(container.firstChild).toHaveClass('justify-between');
  });

  it('applies wrap classes', () => {
    const { container } = render(<Flex wrap="wrap">Content</Flex>);

    expect(container.firstChild).toHaveClass('flex-wrap');
  });

  it('applies gap classes', () => {
    const { container } = render(<Flex gap="md">Content</Flex>);

    expect(container.firstChild).toHaveClass('gap-4');
  });

  it('applies custom className', () => {
    const { container } = render(<Flex className="custom-class">Content</Flex>);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies all props together', () => {
    const { container } = render(
      <Flex
        direction="col"
        align="center"
        justify="between"
        wrap="wrap"
        gap="lg"
      >
        Content
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex-col');
    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).toHaveClass('justify-between');
    expect(container.firstChild).toHaveClass('flex-wrap');
    expect(container.firstChild).toHaveClass('gap-6');
  });
});

describe('FlexItem', () => {
  it('renders children', () => {
    const { getByText } = render(<FlexItem>Item Content</FlexItem>);

    expect(getByText('Item Content')).toBeInTheDocument();
  });

  it('applies grow classes', () => {
    const { container } = render(<FlexItem grow={1}>Content</FlexItem>);

    expect(container.firstChild).toHaveClass('flex-grow');
  });

  it('applies shrink classes', () => {
    const { container } = render(<FlexItem shrink={0}>Content</FlexItem>);

    expect(container.firstChild).toHaveClass('flex-shrink-0');
  });

  it('applies basis classes', () => {
    const { container } = render(<FlexItem basis="1/2">Content</FlexItem>);

    expect(container.firstChild).toHaveClass('basis-1/2');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FlexItem className="custom-class">Content</FlexItem>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

