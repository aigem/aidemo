import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { App } from '../services/appService';
import { appService } from '../services/appService';
import { errorHandler } from '../utils/errorHandler';

// 状态接口
interface AppState {
  apps: App[];
  loading: boolean;
  error: string | null;
}

// Action 类型
type AppAction =
  | { type: 'LOAD_APPS_START' }
  | { type: 'LOAD_APPS_SUCCESS'; payload: App[] }
  | { type: 'LOAD_APPS_ERROR'; payload: string }
  | { type: 'ADD_APP'; payload: App }
  | { type: 'UPDATE_APP'; payload: App }
  | { type: 'DELETE_APP'; payload: string };

// 初始状态
const initialState: AppState = {
  apps: [],
  loading: false,
  error: null
};

// 创建上下文
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Reducer 函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_APPS_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_APPS_SUCCESS':
      return { ...state, loading: false, apps: action.payload };
    case 'LOAD_APPS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_APP':
      return { ...state, apps: [...state.apps, action.payload] };
    case 'UPDATE_APP':
      return {
        ...state,
        apps: state.apps.map(app =>
          app.id === action.payload.id ? action.payload : app
        )
      };
    case 'DELETE_APP':
      return {
        ...state,
        apps: state.apps.filter(app => app.id !== action.payload)
      };
    default:
      return state;
  }
}

// Provider 组件
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function loadApps() {
      dispatch({ type: 'LOAD_APPS_START' });
      try {
        const response = await appService.getApps();
        dispatch({ type: 'LOAD_APPS_SUCCESS', payload: response.items });
      } catch (error) {
        const message = errorHandler.getErrorMessage(error, 'Loading apps');
        dispatch({ type: 'LOAD_APPS_ERROR', payload: message });
      }
    }
    loadApps();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApps() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApps must be used within an AppProvider');
  }

  const { state, dispatch } = context;

  return {
    apps: state.apps,
    loading: state.loading,
    error: state.error,
    addApp: async (app: App) => {
      try {
        const newApp = await appService.addApp(app);
        dispatch({ type: 'ADD_APP', payload: newApp });
        return newApp;
      } catch (error) {
        throw new Error(errorHandler.getErrorMessage(error, 'Adding app'));
      }
    },
    updateApp: async (app: App) => {
      try {
        const updatedApp = await appService.updateApp(app);
        dispatch({ type: 'UPDATE_APP', payload: updatedApp });
        return updatedApp;
      } catch (error) {
        throw new Error(errorHandler.getErrorMessage(error, 'Updating app'));
      }
    },
    deleteApp: async (appId: string) => {
      try {
        await appService.deleteApp(appId);
        dispatch({ type: 'DELETE_APP', payload: appId });
      } catch (error) {
        throw new Error(errorHandler.getErrorMessage(error, 'Deleting app'));
      }
    }
  };
}