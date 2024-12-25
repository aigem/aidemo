import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApps } from '../contexts/AppContext';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const { state, dispatch } = useApps();
  const { page } = state;

  const handlePageChange = (newPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center space-x-2 mt-8">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`px-4 py-2 rounded-md border ${
            pageNum === page
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}