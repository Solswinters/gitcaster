import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { NotificationItem } from '@/features/notifications/components/NotificationItem';

describe('NotificationItem', () => {
  const defaultProps = {
    id: '1',
    title: 'New Message',
    message: 'You have a new message from John',
    timestamp: '2 minutes ago',
  };

  it('renders notification title and message', () => {
    render(<NotificationItem {...defaultProps} />);
    expect(screen.getByText('New Message')).toBeInTheDocument();
    expect(screen.getByText('You have a new message from John')).toBeInTheDocument();
  });

  it('renders timestamp', () => {
    render(<NotificationItem {...defaultProps} />);
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument();
  });

  it('shows unread indicator for unread notifications', () => {
    const { container } = render(<NotificationItem {...defaultProps} read={false} />);
    const indicator = container.querySelector('.bg-blue-600');
    expect(indicator).toBeInTheDocument();
  });

  it('does not show unread indicator for read notifications', () => {
    const { container } = render(<NotificationItem {...defaultProps} read />);
    const indicator = container.querySelector('.bg-blue-600');
    expect(indicator).not.toBeInTheDocument();
  });

  it('displays correct type badge', () => {
    render(<NotificationItem {...defaultProps} type="success" />);
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('calls onRead when mark as read button clicked', () => {
    const onRead = jest.fn();
    render(<NotificationItem {...defaultProps} read={false} onRead={onRead} />);

    const button = screen.getByTitle('Mark as read');
    fireEvent.click(button);

    expect(onRead).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = jest.fn();
    render(<NotificationItem {...defaultProps} onDelete={onDelete} />);

    const button = screen.getByTitle('Delete');
    fireEvent.click(button);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('calls onClick when notification clicked', () => {
    const onClick = jest.fn();
    render(<NotificationItem {...defaultProps} onClick={onClick} />);

    const notification = screen.getByText('New Message').closest('div');
    fireEvent.click(notification!);

    expect(onClick).toHaveBeenCalledWith('1');
  });

  it('calls onRead when unread notification clicked', () => {
    const onRead = jest.fn();
    render(<NotificationItem {...defaultProps} read={false} onRead={onRead} />);

    const notification = screen.getByText('New Message').closest('div');
    fireEvent.click(notification!);

    expect(onRead).toHaveBeenCalledWith('1');
  });

  it('does not show mark as read button for read notifications', () => {
    render(<NotificationItem {...defaultProps} read onRead={jest.fn()} />);
    expect(screen.queryByTitle('Mark as read')).not.toBeInTheDocument();
  });

  it('applies correct background color for unread', () => {
    const { container } = render(<NotificationItem {...defaultProps} read={false} />);
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });

  it('applies correct background color for read', () => {
    const { container } = render(<NotificationItem {...defaultProps} read />);
    expect(container.firstChild).toHaveClass('bg-white');
  });
});

