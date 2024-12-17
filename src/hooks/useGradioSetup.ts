import { useEffect, useRef } from 'react';
import { loadGradioResources } from '../utils/gradioLoader';

export const useGradioSetup = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGradioResources();
  }, []);

  return containerRef;
};