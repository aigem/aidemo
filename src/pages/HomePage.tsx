/** @jsxImportSource react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApps } from '../contexts/AppContext';
import { AppCard } from '../components/AppCard';
import { AppViewer } from '../components/AppViewer';
import { AppSearch } from '../components/AppSearch';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEO } from '../components/SEO';
import type { App } from '../services/appService';

export function HomePage() {
  const navigate = useNavigate();
  const { apps, loading, error } = useApps();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  // 过滤应用
  const filteredApps = apps.filter(app => {
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.description?.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" message="加载应用列表..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              独门 AI DEMO
            </h1>
            <p className="text-lg text-gray-600">
              发现和体验最新的 AI 应用
            </p>
          </div>

          <AppSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索应用..."
          />

          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                没有找到匹配的应用
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {filteredApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => setSelectedApp(app)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <AppViewer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
}