import React from 'react';
import type { GradioAppProps } from '@/types/gradio';

export const GradioApp: React.FC<GradioAppProps> = ({ src, className }) => (
  <gradio-app 
    src={src}
    className={className}
  />
);