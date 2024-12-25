import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GradioApp } from '../types/app';
import { CATEGORIES } from '../types/app';
import * as appService from '../services/appService';

interface AppState {
  apps: GradioApp[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  category: string;
  page: number;
  itemsPerPage: number;
}

type AppAction =
  | { type: 'SET_APPS'; payload: GradioApp[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_PAGE'; payload: number };

const initialState: AppState = {
  apps: [],
  loading: false,
  error: null,
  searchQuery: '',
  category: 'all',
  page: 1,
  itemsPerPage: 9
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function validateApp(app: GradioApp): string | null {
  if (!app.name?.trim()) {
    return '应用名称不能为空';
  }
  if (!app.directUrl?.trim()) {
    return '应用地址不能为空';
  }
  if (!app.category) {
    app.category = '其他';
  }
  if (!CATEGORIES.includes(app.category)) {
    return `无效的应用类别: ${app.category}。有效类别: ${CATEGORIES.join(', ')}`;
  }
  return null;
}

function validateApps(apps: GradioApp[]): string | null {
  if (!Array.isArray(apps)) {
    return '无效的应用数据格式';
  }

  for (const app of apps) {
    const error = validateApp(app);
    if (error) {
      return error;
    }
  }

  return null;
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_APPS': {
      const error = validateApps(action.payload);
      if (error) {
        return { ...state, error };
      }
      return { ...state, apps: action.payload, error: null };
    }
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const apps = await appService.getApps();
        const appsWithCategory = apps.map(app => ({
          ...app,
          category: app.category || '其他'
        }));
        const error = validateApps(appsWithCategory);
        if (error) {
          dispatch({ type: 'SET_ERROR', payload: error });
        } else {
          dispatch({ type: 'SET_APPS', payload: appsWithCategory });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : '加载应用失败';
        dispatch({ type: 'SET_ERROR', payload: message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApps = () => useContext(AppContext);