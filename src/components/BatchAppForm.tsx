import React, { useState } from 'react';
import type { App } from '../services/appService';
import { FormFeedback } from './FormFeedback';

interface BatchAppFormProps {
  onSubmit: (apps: Omit<App, 'id'>[]) => void;
}

export function BatchAppForm({ onSubmit }: BatchAppFormProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 验证 JSON 格式
      const apps = JSON.parse(jsonText);

      // 验证数组格式
      if (!Array.isArray(apps)) {
        setError('JSON 数据必须是数组格式');
        return;
      }

      // 验证每个应用的数据格式
      const isValid = apps.every(app => {
        if (!app.name || typeof app.name !== 'string') {
          setError('每个应用必须包含 name 字段');
          return false;
        }
        if (!app.directUrl || typeof app.directUrl !== 'string') {
          setError('每个应用必须包含 directUrl 字段');
          return false;
        }
        if (!app.category || typeof app.category !== 'string') {
          setError('每个应用必须包含 category 字段');
          return false;
        }
        return true;
      });

      if (isValid) {
        onSubmit(apps);
      }
    } catch (err) {
      setError('JSON 格式不正确');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      {error && (
        <FormFeedback type="error" message={error} />
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="jsonText" className="block text-sm font-medium text-gray-700">
            JSON 数据
          </label>
          <div className="mt-1">
            <textarea
              id="jsonText"
              name="jsonText"
              rows={10}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={`[
    {
        "name": "应用名称",
        "description": "应用描述",
        "category": "应用分类",
        "directUrl": "应用地址"
    }
]`}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            请输入符合格式的 JSON 数组数据，每个对象必须包含 name、category 和 directUrl 字段
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            批量添加
          </button>
        </div>
      </div>
    </form>
  );
}