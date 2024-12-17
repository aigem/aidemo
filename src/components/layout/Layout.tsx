import React from 'react';
import { Navigation } from '../navigation/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-[56px]"> {/* Adjust padding-top to match navbar height */}
        {children}
      </div>
    </div>
  );
};