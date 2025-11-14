import React from 'react';
import { render } from '@testing-library/react';
import { Grid, GridItem } from '@/shared/components/layout/Grid';

describe('Grid', () => {
  it('renders children', () => {
    const { container } = render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid');
  });

  it('applies column classes', () => {
    const { container } = render(<Grid cols={3}>Content</Grid>);

    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('applies gap classes', () => {
    const { container } = render(<Grid gap="lg">Content</Grid>);

    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('applies responsive column classes', () => {
    const { container } = render(
      <Grid cols={1} responsive={{ md: 2, lg: 4 }}>
        Content
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid-cols-1');
    expect(container.firstChild).toHaveClass('md:grid-cols-2');
    expect(container.firstChild).toHaveClass('lg:grid-cols-4');
  });

  it('applies custom className', () => {
    const { container } = render(<Grid className="custom-class">Content</Grid>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('GridItem', () => {
  it('renders children', () => {
    const { getByText } = render(<GridItem>Item Content</GridItem>);

    expect(getByText('Item Content')).toBeInTheDocument();
  });

  it('applies colSpan classes', () => {
    const { container } = render(<GridItem colSpan={3}>Content</GridItem>);

    expect(container.firstChild).toHaveClass('col-span-3');
  });

  it('applies rowSpan classes', () => {
    const { container } = render(<GridItem rowSpan={2}>Content</GridItem>);

    expect(container.firstChild).toHaveClass('row-span-2');
  });

  it('applies full column span', () => {
    const { container } = render(<GridItem colSpan="full">Content</GridItem>);

    expect(container.firstChild).toHaveClass('col-span-full');
  });

  it('applies custom className', () => {
    const { container } = render(
      <GridItem className="custom-class">Content</GridItem>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

