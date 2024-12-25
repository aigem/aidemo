import { apiClient } from './client';
import type { GradioApp } from '../types/app';
import type { ApiResponse } from './types';

export const appsApi = {
  getApps: () => apiClient.get<GradioApp[]>('/apps'),
  
  createApp: (app: GradioApp) => 
    apiClient.post<GradioApp>('/apps', app),
  
  updateApp: (app: GradioApp) => 
    apiClient.put<GradioApp>(`/apps/${encodeURIComponent(app.directUrl)}`, app),
  
  deleteApp: (directUrl: string) => 
    apiClient.delete<void>(`/apps/${encodeURIComponent(directUrl)}`),
  
  importApps: (apps: GradioApp[]) => 
    apiClient.post<GradioApp[]>('/apps/import', apps),
};