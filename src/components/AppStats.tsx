import React from 'react';
import { BarChart2, Layout, Tag } from 'lucide-react';
import { useApps } from '../contexts/AppContext';

export function AppStats() {
  const { state } = useApps();
  const { apps } = state;

  const stats = {
    total: apps.length,
    categories: Object.entries(
      apps.reduce((acc, app) => {
        acc[app.category] = (acc[app.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Layout className="w-5 h-5 text-blue-500" />
          <h3 className="text-gray-600">Total Apps</h3>
        </div>
        <p className="text-2xl font-semibold mt-2">{stats.total}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-green-500" />
          <h3 className="text-gray-600">Categories</h3>
        </div>
        <p className="text-2xl font-semibold mt-2">{stats.categories.length}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <h3 className="text-gray-600">Most Popular</h3>
        </div>
        <p className="text-2xl font-semibold mt-2">
          {stats.categories.sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
        </p>
      </div>
    </div>
  );
}