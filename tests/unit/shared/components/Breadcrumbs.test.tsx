import React from 'react';
import { render } from '@testing-library/react';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Item', href: '/products/item' },
  ];

  it('renders all breadcrumb items', () => {
    const { getByText } = render(<Breadcrumbs items={items} />);

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Products')).toBeInTheDocument();
    expect(getByText('Item')).toBeInTheDocument();
  });

  it('renders links for non-last items', () => {
    const { getByText } = render(<Breadcrumbs items={items} />);

    const homeLink = getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    const productsLink = getByText('Products').closest('a');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('renders last item without link', () => {
    const { getByText } = render(<Breadcrumbs items={items} />);

    const lastItem = getByText('Item');
    expect(lastItem.closest('a')).toBeNull();
  });

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumbs items={items} />);

    const separators = container.querySelectorAll('.breadcrumb-separator');
    expect(separators.length).toBe(2); // 2 separators for 3 items
  });
});

