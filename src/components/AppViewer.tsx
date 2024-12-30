import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import type { App } from '../services/appService';

interface AppViewerProps {
  app: App;
  onClose: () => void;
}

export function AppViewer({ app, onClose }: AppViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'fixed inset-4 z-50 bg-white rounded-lg shadow-xl';

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {app.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {app.description || '暂无描述'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`w-full ${isFullscreen ? 'h-[calc(100%-64px)]' : 'h-[calc(100%-64px)]'}`}>
        <iframe
          src={app.directUrl}
          title={app.name}
          className="w-full h-full border-0"
          allow="accelerometer; camera; microphone; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}