import React, { useEffect, useRef } from 'react';

const GradioContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGradioScript = async () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://gradio.s3-us-west-2.amazonaws.com/5.5.0/gradio.js';
      document.body.appendChild(script);
    };

    loadGradioScript();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 w-full max-w-7xl mx-auto p-4">
      <gradio-app 
        src="https://fffiloni-echomimic-v2.hf.space"
        className="w-full h-full min-h-[600px] rounded-lg shadow-xl"
      />
    </div>
  );
};

export default GradioContainer;