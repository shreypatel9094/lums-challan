import React, { useState, useCallback } from 'react';
import { AppProvider } from './hooks/useAppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';
import ChallanListPage from './pages/ChallanListPage';
import CreateChallanPage from './pages/CreateChallanPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import CustomerLedgerPage from './pages/CustomerLedgerPage';
import { Page, Challan } from './types';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingChallan, setEditingChallan] = useState<Challan | null>(null);
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);

  const navigateTo = useCallback((page: Page) => {
    setEditingChallan(null);
    setViewingCustomerId(null);
    setCurrentPage(page);
  }, []);

  const handleEditChallan = useCallback((challan: Challan) => {
    setEditingChallan(challan);
    setCurrentPage('create-challan');
  }, []);
  
  const handleNewChallan = useCallback(() => {
    setEditingChallan(null);
    setCurrentPage('create-challan');
  }, []);

  const handleViewCustomer = useCallback((customerId: string) => {
    setViewingCustomerId(customerId);
    setCurrentPage('customer-ledger');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNewChallan={handleNewChallan} />;
      case 'customers':
        return <CustomersPage onViewCustomer={handleViewCustomer} />;
      case 'challans':
        return <ChallanListPage onEditChallan={handleEditChallan} />;
      case 'create-challan':
        return <CreateChallanPage challanToEdit={editingChallan} onSave={() => navigateTo('challans')} />;
      case 'payments':
        return <PaymentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'customer-ledger':
        return viewingCustomerId ? <CustomerLedgerPage customerId={viewingCustomerId} onBack={() => navigateTo('customers')} /> : <CustomersPage onViewCustomer={handleViewCustomer} />;
      default:
        return <Dashboard onNewChallan={handleNewChallan} />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentPage={currentPage} navigateTo={navigateTo} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
             <h1 className="text-2xl font-semibold text-gray-800 capitalize">{currentPage === 'customer-ledger' ? 'Customer Ledger' : (currentPage.split('-').join(' '))}</h1>
             {currentPage !== 'customer-ledger' && (
                <button onClick={handleNewChallan} className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
                  <PlusIcon className="w-5 h-5"/>
                  New Challan
                </button>
             )}
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;