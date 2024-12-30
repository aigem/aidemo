import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { debounce } from '../utils/debounce';

interface AppSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AppSearch({ value, onChange, placeholder = '搜索应用...' }: AppSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  // 使用防抖处理搜索
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 300),
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
}