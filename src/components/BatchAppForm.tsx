import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { GradioApp } from '../types/app';
import { CATEGORIES } from '../types/app';

interface BatchAppFormProps {
  onSubmit: (apps: GradioApp[]) => void;
  onClose: () => void;
}

export function BatchAppForm({ onSubmit, onClose }: BatchAppFormProps) {
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('其他');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 按行分割输入
      const lines = inputText.split('\n').filter(line => line.trim());

      const apps: GradioApp[] = lines.map(line => {
        const [url, name, ...descParts] = line.split(',').map(s => s.trim());
        if (!url || !name) {
          throw new Error('每行必须至少包含 URL 和名称，用逗号分隔');
        }
        return {
          directUrl: url,
          name: name,
          description: descParts.join(',') || name,
          category: category
        };
      });

      if (apps.length === 0) {
        throw new Error('请至少输入一个应用');
      }

      onSubmit(apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : '输入格式错误');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">批量添加应用</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用列表
            </label>
            <p className="text-sm text-gray-500 mb-2">
              每行一个应用，格式：URL,名称,描述（描述可选）
            </p>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full h-64 p-2 border rounded-md"
              placeholder="https://example1.com,应用1,这是应用1的描述&#10;https://example2.com,应用2,这是应用2的描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              应用类别
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              所有导入的应用将使用相同的类别
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              导入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}