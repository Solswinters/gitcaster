import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Code } from '@/shared/components/display/Code';
import * as clipboard from '@/shared/utils/clipboard';

jest.mock('@/shared/utils/clipboard');

describe('Code', () => {
  const defaultProps = {
    code: 'console.log("Hello, World!");',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders code content', () => {
    render(<Code {...defaultProps} />);
    expect(screen.getByText('console.log("Hello, World!");')).toBeInTheDocument();
  });

  it('displays language label', () => {
    render(<Code {...defaultProps} language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('shows copy button', () => {
    render(<Code {...defaultProps} />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copies code to clipboard when button clicked', async () => {
    (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);
    render(<Code {...defaultProps} />);

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    expect(clipboard.copyToClipboard).toHaveBeenCalledWith(defaultProps.code);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('shows copied confirmation temporarily', async () => {
    jest.useFakeTimers();
    (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(true);
    render(<Code {...defaultProps} />);

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('displays line numbers when enabled', () => {
    const multilineCode = 'line 1\nline 2\nline 3';
    render(<Code code={multilineCode} showLineNumbers />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Code {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

