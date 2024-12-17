import React, { Suspense } from 'react';
import { ErrorBoundary } from './utils';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/loading/LoadingSpinner';

// Lazy load the GradioContainer component
const GradioContainer = React.lazy(() => 
  import('./components/gradio/GradioContainer').then(module => ({
    default: module.GradioContainer
  }))
);

function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <main className="flex-1 flex">
          <Suspense fallback={<LoadingSpinner />}>
            <GradioContainer />
          </Suspense>
        </main>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;