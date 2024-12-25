import React from 'react';
import { Monitor, Code2 } from 'lucide-react';
import { AppCard } from '../components/AppCard';
import { AppViewer } from '../components/AppViewer';
import { AppSearch } from '../components/AppSearch';
import { Pagination } from '../components/Pagination';
import { AppStats } from '../components/AppStats';
import { useApps } from '../contexts/AppContext';
import { useAppFilters } from '../hooks/useAppFilters';

export const HomePage = React.memo(function HomePage() {
  const { state, dispatch } = useApps();
  const { apps, searchQuery, category, page, itemsPerPage } = state;
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('webcomponent');

  const { paginatedApps, totalPages } = useAppFilters(
    apps,
    searchQuery,
    category,
    page,
    itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                热门Ai应用 & 推荐 & Demo
              </h1>
              <div className="flex space-x-4">
                
              </div>
            </div>
            <div className="flex space-x-4">
              <AppSearch />
              <select
                value={category}
                onChange={(e) => dispatch({ 
                  type: 'SET_CATEGORY', 
                  payload: e.target.value 
                })}
                className="rounded-md border-gray-300"
              >
                <option value="all">All Categories</option>
                {/* Add your categories here */}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AppStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedApps.map((app) => (
            <AppCard
              key={app.directUrl}
              app={app}
              onSelect={setSelectedApp}
              viewOnly
            />
          ))}
        </div>

        <Pagination totalPages={totalPages} />

        {selectedApp && (
          <AppViewer
            app={selectedApp}
            viewMode={viewMode}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </main>
    </div>
  );
});