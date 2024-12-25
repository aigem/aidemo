import { useMemo } from 'react';
import type { GradioApp } from '../types/app';

export function useAppFilters(
  apps: GradioApp[],
  searchQuery: string,
  category: string,
  page: number,
  itemsPerPage: number
) {
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = searchQuery
        ? app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = category === 'all' || app.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, category]);

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  return {
    filteredApps,
    paginatedApps,
    totalPages,
    totalApps: filteredApps.length
  };
}