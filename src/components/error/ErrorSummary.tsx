interface ErrorSummaryProps {
  errors: Array<{ field?: string; message: string }>;
  title?: string;
}

export function ErrorSummary({ errors, title = 'Please fix the following errors:' }: ErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
      <h3 className="text-sm font-semibold text-red-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-800 flex items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 mr-2 flex-shrink-0"></span>
            {error.field && <span className="font-medium mr-1">{error.field}:</span>}
            <span>{error.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

