import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { GradioApp } from '../types/app';

interface AppViewerProps {
  app: GradioApp;
  onClose: () => void;
  viewMode: 'webcomponent' | 'iframe';
}

export function AppViewer({ app, onClose, viewMode }: AppViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{app.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {viewMode === 'webcomponent' ? (
            <gradio-app src={app.directUrl}></gradio-app>
          ) : (
            <iframe
              src={app.directUrl}
              frameBorder="0"
              width="100%"
              height="450"
              className="rounded"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}