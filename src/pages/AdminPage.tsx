import React, { useState } from 'react';
import { useApps } from '../contexts/AppContext';
import { AppForm } from '../components/AppForm';
import { BatchAppForm } from '../components/BatchAppForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SEO } from '../components/SEO';
import type { App } from '../services/appService';

export function AdminPage() {
  const { apps, loading, error, addApp, updateApp, deleteApp } = useApps();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showBatchForm, setShowBatchForm] = useState(false);

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
      <SEO title="管理应用 - 独门 AI DEMO" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              管理应用
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBatchForm(false)}
                className={`px-4 py-2 rounded-md ${!showBatchForm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
                  }`}
              >
                单个添加
              </button>
              <button
                onClick={() => setShowBatchForm(true)}
                className={`px-4 py-2 rounded-md ${showBatchForm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
                  }`}
              >
                批量添加
              </button>
            </div>
          </div>

          {showBatchForm ? (
            <BatchAppForm onSubmit={addApp} />
          ) : (
            <AppForm
              app={selectedApp}
              onSubmit={app => {
                if (selectedApp) {
                  updateApp(app);
                } else {
                  addApp(app);
                }
                setSelectedApp(null);
              }}
              onCancel={() => setSelectedApp(null)}
            />
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              应用列表
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {apps.map(app => (
                  <li
                    key={app.id}
                    className="px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {app.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {app.description ||
                            '暂无描述'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setSelectedApp(app)
                          }
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() =>
                            deleteApp(app.id)
                          }
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}