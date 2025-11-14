import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from '@/shared/components/forms/Form';

describe('Form', () => {
  const defaultProps = {
    initialValues: { email: '', password: '' },
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial values', () => {
    render(
      <Form {...defaultProps}>
        {({ values, handleChange }) => (
          <>
            <input
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email"
            />
            <input
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Password"
            />
          </>
        )}
      </Form>
    );

    expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
  });

  it('updates values on change', () => {
    render(
      <Form {...defaultProps}>
        {({ values, handleChange }) => (
          <input
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
          />
        )}
      </Form>
    );

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(input).toHaveValue('test@example.com');
  });

  it('validates on submit', async () => {
    const validate = jest.fn((values: any) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      return errors;
    });

    render(
      <Form {...defaultProps} validate={validate}>
        {({ errors, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
            {errors.email && <span>{errors.email}</span>}
          </form>
        )}
      </Form>
    );

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid values', async () => {
    const onSubmit = jest.fn();

    render(
      <Form {...defaultProps} onSubmit={onSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <input
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    );

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: '' });
    });
  });

  it('shows submitting state', async () => {
    const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <Form {...defaultProps} onSubmit={onSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </Form>
    );

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });
});

