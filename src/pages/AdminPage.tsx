import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import type { GradioApp } from '../types/app';
import { AppCard } from '../components/AppCard';
import { AppForm } from '../components/AppForm';
import { BatchAppForm } from '../components/BatchAppForm';
import { addApps, deleteApp, updateApp, getApps } from '../services/appService';
import { logout } from '../services/authService';
import { useApps } from '../contexts/AppContext';

export function AdminPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApps();
  const [editingApp, setEditingApp] = useState<GradioApp | null>(null);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [isBatchAdding, setIsBatchAdding] = useState(false);

  const handleAddApps = useCallback(async (newApps: GradioApp[]) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedApps = await addApps(newApps);
      dispatch({ type: 'SET_APPS', payload: updatedApps });
      setIsBatchAdding(false);
      setIsAddingApp(false);
      dispatch({ type: 'SET_ERROR', payload: '应用添加成功' });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 3000);
    } catch (err) {
      console.error('添加应用失败:', err);
      const errorMessage = err instanceof Error ? err.message : '添加应用失败，请检查应用地址是否正确';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const handleUpdateApp = useCallback(async (updatedApp: GradioApp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedApps = await updateApp(updatedApp);
      dispatch({ type: 'SET_APPS', payload: updatedApps });
      setEditingApp(null);
      dispatch({ type: 'SET_ERROR', payload: '应用更新成功' });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 3000);
    } catch (err) {
      console.error('更新应用失败:', err);
      const errorMessage = err instanceof Error ? err.message : '更新应用失败，请检查应用是否存在';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const handleDeleteApp = async (app: GradioApp) => {
    if (window.confirm(`确定要删除应用 "${app.name}" 吗？`)) {
      try {
        await deleteApp(app.directUrl);
        dispatch({ type: 'SET_APPS', payload: await getApps() });
      } catch (error) {
        console.error('删除应用失败:', error);
      }
    }
  };

  const handleLogout = useCallback(() => {
    if (!window.confirm('确定要退出登录吗？')) {
      return;
    }

    try {
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '退出登录失败，请稍后重试';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [navigate, dispatch]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">管理控制台</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {state.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setIsAddingApp(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>添加单个应用</span>
          </button>
          <button
            onClick={() => setIsBatchAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>批量添加应用</span>
          </button>
        </div>

        {state.apps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无应用，请点击上方按钮添加应用
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.apps.map((app) => (
              <AppCard
                key={app.directUrl}
                app={app}
                onEdit={setEditingApp}
                onDelete={handleDeleteApp}
                viewOnly={false}
              />
            ))}
          </div>
        )}

        {isAddingApp && (
          <AppForm
            onSubmit={(app) => handleAddApps([app])}
            onClose={() => setIsAddingApp(false)}
          />
        )}

        {isBatchAdding && (
          <BatchAppForm
            onSubmit={handleAddApps}
            onClose={() => setIsBatchAdding(false)}
          />
        )}

        {editingApp && (
          <AppForm
            initialData={editingApp}
            onSubmit={handleUpdateApp}
            onClose={() => setEditingApp(null)}
          />
        )}
      </main>
    </div>
  );
}