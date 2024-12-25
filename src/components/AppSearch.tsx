import React from 'react';
import { Search } from 'lucide-react';
import { useApps } from '../contexts/AppContext';
import { CATEGORIES } from '../types/app';

export function AppSearch() {
  const { state, dispatch } = useApps();

  return (
    <div className="flex space-x-4 w-full">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={state.searchQuery || ''}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          placeholder="搜索应用..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <select
        value={state.category || 'all'}
        onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="all">所有类别</option>
        {CATEGORIES.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}