import React from 'react';
import type { App } from '../services/appService';

interface AppCardProps {
  app: App;
  onClick?: () => void;
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {app.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {app.description || '暂无描述'}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {app.category}
          </span>
          {app.author && (
            <span className="text-sm text-gray-500">
              作者: {app.author.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}