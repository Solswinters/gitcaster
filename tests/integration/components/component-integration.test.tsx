/**
 * Component Integration Tests
 *
 * Test components working together in realistic scenarios
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import { Table } from '@/shared/components/ui/Table';
import { Pagination } from '@/shared/components/ui/Pagination';
import { useState } from 'react';

describe('Component Integration', () => {
  describe('Table with Pagination', () => {
    const TableWithPagination = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const data = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
      }));

      const pageSize = 10;
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = data.slice(startIndex, startIndex + pageSize);

      return (
        <div>
          <Table
            columns={[
              { key: 'id', title: 'ID' },
              { key: 'name', title: 'Name' },
            ]}
            data={paginatedData}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.length / pageSize)}
            onPageChange={setCurrentPage}
          />
        </div>
      );
    };

    it('displays first page of data', () => {
      render(<TableWithPagination />);

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();
      expect(screen.queryByText('User 11')).not.toBeInTheDocument();
    });

    it('navigates to next page', () => {
      render(<TableWithPagination />);

      fireEvent.click(screen.getByLabelText('Next page'));

      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
      expect(screen.getByText('User 11')).toBeInTheDocument();
      expect(screen.getByText('User 20')).toBeInTheDocument();
    });
  });

  describe('Modal with Form', () => {
    const ModalWithForm = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [submitted, setSubmitted] = useState(false);

      const handleSubmit = () => {
        setSubmitted(true);
        setIsOpen(false);
      };

      return (
        <div>
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Form Modal"
          >
            <div>
              <input type="text" placeholder="Enter name" />
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </Modal>
          {submitted && <div>Form submitted!</div>}
        </div>
      );
    };

    it('opens modal on button click', () => {
      render(<ModalWithForm />);

      fireEvent.click(screen.getByText('Open Modal'));

      expect(screen.getByText('Form Modal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('submits form and closes modal', () => {
      render(<ModalWithForm />);

      fireEvent.click(screen.getByText('Open Modal'));
      fireEvent.click(screen.getAllByText('Submit')[0]);

      expect(screen.queryByText('Form Modal')).not.toBeInTheDocument();
      expect(screen.getByText('Form submitted!')).toBeInTheDocument();
    });
  });

  describe('Card with Button', () => {
    const CardWithButton = () => {
      const [clicked, setClicked] = useState(false);

      return (
        <Card title="Test Card" description="Card description">
          <Button onClick={() => setClicked(true)}>
            {clicked ? 'Clicked!' : 'Click me'}
          </Button>
        </Card>
      );
    };

    it('renders card with button', () => {
      render(<CardWithButton />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles button click', () => {
      render(<CardWithButton />);

      fireEvent.click(screen.getByText('Click me'));

      expect(screen.getByText('Clicked!')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    const ComponentWithLoading = () => {
      const [loading, setLoading] = useState(true);

      return (
        <div>
          <Button onClick={() => setLoading(!loading)}>Toggle Loading</Button>
          <Table
            columns={[{ key: 'name', title: 'Name' }]}
            data={[{ name: 'Test' }]}
            loading={loading}
          />
        </div>
      );
    };

    it('shows loading state', () => {
      render(<ComponentWithLoading />);

      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('shows data when not loading', () => {
      render(<ComponentWithLoading />);

      fireEvent.click(screen.getByText('Toggle Loading'));

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});

