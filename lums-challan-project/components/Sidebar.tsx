
import React from 'react';
import { Page } from '../types';
import { ChartPieIcon, Cog6ToothIcon, DocumentDuplicateIcon, HomeIcon, PlusCircleIcon, UserGroupIcon, CurrencyDollarIcon } from './Icons';

interface SidebarProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, navigateTo }) => {
  // FIX: Explicitly type the navItems array to ensure `page` is of type `Page`.
  const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { page: 'customers', label: 'Customers', icon: UserGroupIcon },
    { page: 'challans', label: 'Challans', icon: DocumentDuplicateIcon },
    { page: 'create-challan', label: 'New Challan', icon: PlusCircleIcon },
    { page: 'payments', label: 'Payments', icon: CurrencyDollarIcon },
    { page: 'reports', label: 'Reports', icon: ChartPieIcon },
    { page: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        LUMS MACHINES
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map(({ page, label, icon: Icon }) => (
            <li key={page} className="mb-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(page);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 mr-3" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-center text-xs text-gray-400">&copy; 2024 LUMS Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
