import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from '@/shared/components/data-display/DataTable';

interface TestData {
  id: number;
  name: string;
  age: number;
  email: string;
}

const mockData: TestData[] = [
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
];

const columns: Column<TestData>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'email', label: 'Email' },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={columns} keyField="id" />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataTable data={mockData} columns={columns} keyField="id" />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('sorts data when column header clicked', () => {
    render(<DataTable data={mockData} columns={columns} keyField="id" sortable />);

    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Bob');
  });

  it('filters data when filter text entered', () => {
    render(<DataTable data={mockData} columns={columns} keyField="id" filterable />);

    const filterInput = screen.getByPlaceholderText('Filter...');
    fireEvent.change(filterInput, { target: { value: 'alice' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('paginates data correctly', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + i,
      email: `user${i + 1}@example.com`,
    }));

    render(<DataTable data={largeData} columns={columns} keyField="id" pageSize={10} />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 11')).not.toBeInTheDocument();

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.getByText('User 11')).toBeInTheDocument();
  });

  it('calls onRowClick when row clicked', () => {
    const handleRowClick = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyField="id"
        onRowClick={handleRowClick}
      />
    );

    const firstRow = screen.getByText('Alice').closest('tr');
    fireEvent.click(firstRow!);

    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders custom cell content', () => {
    const customColumns: Column<TestData>[] = [
      ...columns,
      {
        key: 'age',
        label: 'Age Category',
        render: (value: number) => (value < 30 ? 'Young' : 'Adult'),
      },
    ];

    render(<DataTable data={mockData} columns={customColumns} keyField="id" />);

    expect(screen.getByText('Young')).toBeInTheDocument();
    expect(screen.getAllByText('Adult')).toHaveLength(2);
  });
});

