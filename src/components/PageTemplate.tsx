// Template page component for dynamic routes
interface PageProps {
  title: string;
  description?: string;
}

export default function PageTemplate({ title, description }: PageProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description}
          </p>
        )}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            This is a placeholder page for <strong>{title}</strong>.
            Content will be added here based on your requirements.
          </p>
        </div>
      </div>
    </div>
  );
}