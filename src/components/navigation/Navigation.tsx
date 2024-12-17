import React from 'react';
import { NavLink } from './NavLink';
import { navigationLinks } from '@/config/navigation';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-700 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
        {navigationLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
    </nav>
  );
};