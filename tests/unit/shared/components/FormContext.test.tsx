import React from 'react';
<parameter name="render">
import { render, screen, fireEvent } from '@testing-library/react';
import {
  FormProvider,
  useFormContext,
  FormFieldContext,
} from '@/shared/components/forms/FormContext';

const TestComponent = () => {
  const context = useFormContext();
  return <div>Values: {JSON.stringify(context.values)}</div>;
};

describe('FormContext', () => {
  const mockContext = {
    values: { email: 'test@example.com' },
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldError: jest.fn(),
    handleSubmit: jest.fn(),
    resetForm: jest.fn(),
  };

  it('provides form context to children', () => {
    render(
      <FormProvider value={mockContext}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('throws error when useFormContext is used outside provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useFormContext must be used within a FormProvider'
    );

    spy.mockRestore();
  });

  describe('FormFieldContext', () => {
    it('renders field with label', () => {
      render(
        <FormProvider value={mockContext}>
          <FormFieldContext name="email" label="Email">
            {({ value }) => <input value={value} readOnly />}
          </FormFieldContext>
        </FormProvider>
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('test@example.com');
    });

    it('shows required indicator', () => {
      render(
        <FormProvider value={mockContext}>
          <FormFieldContext name="email" label="Email" required>
            {({ value }) => <input value={value} readOnly />}
          </FormFieldContext>
        </FormProvider>
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows error when field is touched', () => {
      const contextWithError = {
        ...mockContext,
        errors: { email: 'Invalid email' },
        touched: { email: true },
      };

      render(
        <FormProvider value={contextWithError}>
          <FormFieldContext name="email" label="Email">
            {({ value }) => <input value={value} readOnly />}
          </FormFieldContext>
        </FormProvider>
      );

      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('calls setFieldValue on change', () => {
      const setFieldValue = jest.fn();

      render(
        <FormProvider value={{ ...mockContext, setFieldValue }}>
          <FormFieldContext name="email" label="Email">
            {({ value, onChange }) => (
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldContext>
        </FormProvider>
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new@example.com' } });

      expect(setFieldValue).toHaveBeenCalledWith('email', 'new@example.com');
    });

    it('calls setFieldTouched on blur', () => {
      const setFieldTouched = jest.fn();

      render(
        <FormProvider value={{ ...mockContext, setFieldTouched }}>
          <FormFieldContext name="email" label="Email">
            {({ value, onBlur }) => (
              <input value={value} onBlur={onBlur} readOnly />
            )}
          </FormFieldContext>
        </FormProvider>
      );

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(setFieldTouched).toHaveBeenCalledWith('email', true);
    });
  });
});

