import React, { useState } from 'react';
import type { App } from '../services/appService';
import { FormFeedback } from './FormFeedback';

interface AppFormProps {
  app?: App | null;
  onSubmit: (app: Omit<App, 'id'>) => void;
  onCancel?: () => void;
}

export function AppForm({ app, onSubmit, onCancel }: AppFormProps) {
  const [formData, setFormData] = useState({
    name: app?.name || '',
    description: app?.description || '',
    category: app?.category || '',
    directUrl: app?.directUrl || ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证表单
    if (!formData.name.trim()) {
      setError('应用名称不能为空');
      return;
    }
    if (!formData.directUrl.trim()) {
      setError('应用地址不能为空');
      return;
    }
    if (!formData.category.trim()) {
      setError('应用分类不能为空');
      return;
    }

    // 提交表单
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      directUrl: formData.directUrl.trim()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      {error && (
        <FormFeedback type="error" message={error} />
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            应用名称
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="输入应用名称"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            应用描述
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="输入应用描述"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            应用分类
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">选择分类</option>
            <option value="文本生成">文本生成</option>
            <option value="图像生成">图像生成</option>
            <option value="音频处理">音频处理</option>
            <option value="视频处理">视频处理</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div>
          <label htmlFor="directUrl" className="block text-sm font-medium text-gray-700">
            应用地址
          </label>
          <input
            type="url"
            id="directUrl"
            name="directUrl"
            value={formData.directUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="输入应用地址"
          />
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {app ? '更新应用' : '添加应用'}
          </button>
        </div>
      </div>
    </form>
  );
}