import { GRADIO_URLS } from '../constants/urls';

export const loadGradioResources = async () => {
  try {
    // Load Gradio CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GRADIO_URLS.CSS;
    document.head.appendChild(link);

    // Load Gradio Script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = GRADIO_URLS.SCRIPT;
    document.body.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Gradio script'));
    });
  } catch (error) {
    console.error('Error loading Gradio resources:', error);
    throw error;
  }
};