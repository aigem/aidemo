import React from 'react';
import { GRADIO_URLS } from '@/constants';
import { useGradioSetup } from '@/hooks';
import { GradioApp } from './GradioApp';

export const GradioContainer: React.FC = () => {
  const containerRef = useGradioSetup();

  return (
    <div ref={containerRef} className="flex-1 w-full max-w-7xl mx-auto p-4">
      <GradioApp 
        src={GRADIO_URLS.APP}
        className="w-full h-full min-h-[calc(100vh-88px)] rounded-lg shadow-xl" // Adjusted height calculation
      />
    </div>
  );
};