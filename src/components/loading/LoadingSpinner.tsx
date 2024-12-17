import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
    </div>
  );
};