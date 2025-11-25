import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: string[];
}

/**
 * ValidationErrors utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ValidationErrors.
 */
export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-yellow-800">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

