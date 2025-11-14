import React from 'react';
import { render } from '@testing-library/react';
import { List, ListItem, DescriptionList } from '@/shared/components/data-display/List';

describe('List', () => {
  it('renders unordered list by default', () => {
    const { container } = render(
      <List>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>
    );

    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders ordered list when variant is ordered', () => {
    const { container } = render(
      <List variant="ordered">
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>
    );

    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('applies spacing classes', () => {
    const { container } = render(
      <List spacing="lg">
        <ListItem>Item 1</ListItem>
      </List>
    );

    expect(container.firstChild).toHaveClass('space-y-4');
  });

  it('applies style type classes', () => {
    const { container } = render(
      <List styleType="square">
        <ListItem>Item 1</ListItem>
      </List>
    );

    expect(container.firstChild).toHaveClass('list-square');
  });

  it('applies custom className', () => {
    const { container } = render(
      <List className="custom-class">
        <ListItem>Item 1</ListItem>
      </List>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('ListItem', () => {
  it('renders children', () => {
    const { getByText } = render(<ListItem>Item Content</ListItem>);

    expect(getByText('Item Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ListItem className="custom-class">Content</ListItem>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('DescriptionList', () => {
  const items = [
    { term: 'Term 1', description: 'Description 1' },
    { term: 'Term 2', description: 'Description 2' },
  ];

  it('renders all items', () => {
    const { getByText } = render(<DescriptionList items={items} />);

    expect(getByText('Term 1')).toBeInTheDocument();
    expect(getByText('Description 1')).toBeInTheDocument();
    expect(getByText('Term 2')).toBeInTheDocument();
    expect(getByText('Description 2')).toBeInTheDocument();
  });

  it('renders stacked layout by default', () => {
    const { container } = render(<DescriptionList items={items} />);

    const dl = container.querySelector('dl');
    expect(dl).not.toHaveClass('grid');
  });

  it('renders horizontal layout', () => {
    const { container } = render(
      <DescriptionList items={items} layout="horizontal" />
    );

    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('grid');
    expect(dl).toHaveClass('grid-cols-3');
  });

  it('applies spacing in stacked layout', () => {
    const { container } = render(
      <DescriptionList items={items} spacing="lg" />
    );

    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('space-y-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <DescriptionList items={items} className="custom-class" />
    );

    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('custom-class');
  });
});

