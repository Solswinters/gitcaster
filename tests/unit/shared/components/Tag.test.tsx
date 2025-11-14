import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tag, TagGroup } from '@/shared/components/data-display/Tag';

describe('Tag', () => {
  it('renders children', () => {
    const { getByText } = render(<Tag>Label</Tag>);

    expect(getByText('Label')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Tag variant="primary">Label</Tag>);

    expect(container.firstChild).toHaveClass('bg-blue-100');
    expect(container.firstChild).toHaveClass('text-blue-800');
  });

  it('applies size classes', () => {
    const { container } = render(<Tag size="lg">Label</Tag>);

    expect(container.firstChild).toHaveClass('text-base');
    expect(container.firstChild).toHaveClass('px-3');
  });

  it('renders icon when provided', () => {
    const { getByTestId } = render(
      <Tag icon={<span data-testid="icon">🏷️</span>}>Label</Tag>
    );

    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('renders remove button when removable', () => {
    const { getByLabelText } = render(<Tag removable>Label</Tag>);

    expect(getByLabelText('Remove tag')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    const { getByLabelText } = render(
      <Tag removable onRemove={onRemove}>
        Label
      </Tag>
    );

    const removeButton = getByLabelText('Remove tag');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Tag className="custom-class">Label</Tag>);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('TagGroup', () => {
  it('renders children', () => {
    const { getByText } = render(
      <TagGroup>
        <Tag>Tag 1</Tag>
        <Tag>Tag 2</Tag>
      </TagGroup>
    );

    expect(getByText('Tag 1')).toBeInTheDocument();
    expect(getByText('Tag 2')).toBeInTheDocument();
  });

  it('applies spacing classes', () => {
    const { container } = render(
      <TagGroup spacing="lg">
        <Tag>Tag 1</Tag>
      </TagGroup>
    );

    expect(container.firstChild).toHaveClass('gap-3');
  });

  it('applies wrap class by default', () => {
    const { container } = render(
      <TagGroup>
        <Tag>Tag 1</Tag>
      </TagGroup>
    );

    expect(container.firstChild).toHaveClass('flex-wrap');
  });

  it('does not apply wrap when wrap is false', () => {
    const { container } = render(
      <TagGroup wrap={false}>
        <Tag>Tag 1</Tag>
      </TagGroup>
    );

    expect(container.firstChild).not.toHaveClass('flex-wrap');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TagGroup className="custom-class">
        <Tag>Tag 1</Tag>
      </TagGroup>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

