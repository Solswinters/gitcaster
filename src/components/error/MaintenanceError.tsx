import { Wrench } from 'lucide-react';

interface MaintenanceErrorProps {
  estimatedTime?: string;
}

export function MaintenanceError({ estimatedTime }: MaintenanceErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-blue-100 p-4 mb-4">
        <Wrench className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Under Maintenance
      </h3>
      <p className="text-gray-600 text-center mb-2 max-w-md">
        We're currently performing scheduled maintenance to improve your experience.
      </p>
      {estimatedTime && (
        <p className="text-sm text-gray-500">
          Estimated completion: {estimatedTime}
        </p>
      )}
    </div>
  );
}

