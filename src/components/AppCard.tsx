import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Pencil, Trash2, Eye } from 'lucide-react';
import type { GradioApp } from '../types/app';
import { getAppPath } from '../utils/url';

interface AppCardProps {
  app: GradioApp;
  onPreview?: (app: GradioApp) => void;
  onEdit?: (app: GradioApp) => void;
  onDelete?: (directUrl: string) => void;
  viewOnly?: boolean;
}

export function AppCard({
  app,
  onPreview,
  onEdit,
  onDelete,
  viewOnly = false
}: AppCardProps) {
  // 生成应用 URL
  const appUrl = getAppPath(app.directUrl);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{app.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {app.directUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          {!viewOnly && onEdit && (
            <button
              onClick={() => onEdit(app)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
              title="编辑应用"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {!viewOnly && onDelete && (
            <button
              onClick={() => onDelete(app.directUrl)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
              title="删除应用"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
          {onPreview && (
            <button
              onClick={() => onPreview(app)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
              title="预览应用"
            >
              <Eye className="w-4 h-4 text-blue-500" />
            </button>
          )}
          <Link
            to={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-gray-100 rounded-full"
            title="在新窗口打开"
          >
            <ExternalLink className="w-4 h-4 text-green-500" />
          </Link>
        </div>
      </div>
      <p className="mt-2 text-gray-600">{app.description}</p>
      {app.category && (
        <div className="mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {app.category}
          </span>
        </div>
      )}
    </div>
  );
}