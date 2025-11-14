import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Notification, NotificationStack } from '@/shared/components/feedback/Notification';

describe('Notification', () => {
  it('renders title', () => {
    const { getByText } = render(<Notification title="Test Notification" />);

    expect(getByText('Test Notification')).toBeInTheDocument();
  });

  it('renders message when provided', () => {
    const { getByText } = render(
      <Notification title="Title" message="This is a message" />
    );

    expect(getByText('This is a message')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(
      <Notification title="Success" variant="success" />
    );

    expect(container.firstChild).toHaveClass('bg-green-50');
    expect(container.firstChild).toHaveClass('border-green-200');
  });

  it('renders default icon for variant', () => {
    const { getByText } = render(
      <Notification title="Success" variant="success" />
    );

    expect(getByText('✓')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const { getByTestId } = render(
      <Notification
        title="Title"
        icon={<span data-testid="custom-icon">🎉</span>}
      />
    );

    expect(getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action button', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Notification
        title="Title"
        action={{ label: 'Click me', onClick }}
      />
    );

    const button = getByText('Click me');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders close button when onClose is provided', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Notification title="Title" onClose={onClose} />
    );

    const closeButton = getByLabelText('Close notification');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('auto closes after duration', async () => {
    const onClose = jest.fn();
    const { container } = render(
      <Notification
        title="Title"
        autoClose
        autoCloseDuration={100}
        onClose={onClose}
      />
    );

    expect(container.firstChild).toBeInTheDocument();

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <Notification title="Title" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('NotificationStack', () => {
  it('renders children', () => {
    const { getByText } = render(
      <NotificationStack>
        <Notification title="Notification 1" />
        <Notification title="Notification 2" />
      </NotificationStack>
    );

    expect(getByText('Notification 1')).toBeInTheDocument();
    expect(getByText('Notification 2')).toBeInTheDocument();
  });

  it('applies position classes', () => {
    const { container } = render(
      <NotificationStack position="bottom-left">
        <Notification title="Title" />
      </NotificationStack>
    );

    expect(container.firstChild).toHaveClass('bottom-4');
    expect(container.firstChild).toHaveClass('left-4');
  });

  it('applies fixed and z-index classes', () => {
    const { container } = render(
      <NotificationStack>
        <Notification title="Title" />
      </NotificationStack>
    );

    expect(container.firstChild).toHaveClass('fixed');
    expect(container.firstChild).toHaveClass('z-50');
  });

  it('applies custom className', () => {
    const { container } = render(
      <NotificationStack className="custom-class">
        <Notification title="Title" />
      </NotificationStack>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

