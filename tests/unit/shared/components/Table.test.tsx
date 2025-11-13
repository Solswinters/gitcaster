import { render, screen, fireEvent } from '@testing-library/react';
import { Table, type TableColumn } from '@/shared/components/ui/Table';

interface TestData {
  id: number;
  name: string;
  age: number;
}

const columns: TableColumn<TestData>[] = [
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'name',
    title: 'Name',
  },
  {
    key: 'age',
    title: 'Age',
    align: 'right',
  },
];

const data: TestData[] = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<Table columns={columns} data={data} loading />);

    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<Table columns={columns} data={[]} emptyText="No users found" />);

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles row click', () => {
    const onRowClick = jest.fn();

    render(<Table columns={columns} data={data} onRowClick={onRowClick} />);

    const firstRow = screen.getByText('John').closest('tr');
    fireEvent.click(firstRow!);

    expect(onRowClick).toHaveBeenCalledWith(data[0], 0);
  });

  it('renders custom cell content', () => {
    const customColumns: TableColumn<TestData>[] = [
      {
        key: 'name',
        title: 'Name',
        render: (value, record) => (
          <strong data-testid={`name-${record.id}`}>{value}</strong>
        ),
      },
    ];

    render(<Table columns={customColumns} data={data} />);

    expect(screen.getByTestId('name-1')).toHaveTextContent('John');
    expect(screen.getByTestId('name-1').tagName).toBe('STRONG');
  });

  it('applies striped style', () => {
    const { container } = render(
      <Table columns={columns} data={data} striped />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[1]).toHaveClass('bg-gray-50');
  });

  it('uses custom row key', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        rowKey={(record) => `user-${record.id}`}
      />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveAttribute('data-testid', undefined); // Keys are internal
  });

  it('renders compact table', () => {
    const { container } = render(<Table columns={columns} data={data} compact />);

    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveClass('px-4', 'py-2');
  });
});

