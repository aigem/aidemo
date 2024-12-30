import React, { useEffect, useState } from 'react';
import { appService } from '../services/appService';
import { errorHandler } from '../utils/errorHandler';
import { LoadingSpinner } from './LoadingSpinner';

interface AppStatsData {
  total: number;
  categories: Record<string, number>;
}

export function AppStats() {
  const [stats, setStats] = useState<AppStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await appService.getAppStats();
        setStats(data);
      } catch (error) {
        const errorMessage = errorHandler.getErrorMessage(error);
        setError(errorMessage);
        console.error('加载统计信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="small" message="加载统计信息..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">应用统计</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">总应用数</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {stats.total}
          </p>
        </div>
        {Object.entries(stats.categories).map(([category, count]) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">{category}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}