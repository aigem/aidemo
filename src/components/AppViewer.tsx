import React from 'react';
import { X } from 'lucide-react';
import type { GradioApp } from '../types/app';

interface AppViewerProps {
  app: GradioApp;
  onClose: () => void;
}

export function AppViewer({ app, onClose }: AppViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{app.name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[600px]">
          <iframe
            src={app.directUrl}
            title={app.name}
            className="w-full h-full border-0"
            allow="accelerometer; camera; microphone; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}