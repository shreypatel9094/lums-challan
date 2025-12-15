
import React, { useState } from 'react';

const ReportsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('receivables');

    const renderReport = () => {
        switch (activeTab) {
            case 'receivables':
                return <ReceivablesReport />;
            case 'sales':
                return <SalesReport />;
            case 'tax':
                return <TaxSummaryReport />;
            default:
                return <ReceivablesReport />;
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('receivables')} className={`${activeTab === 'receivables' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Outstanding Receivables
                    </button>
                    <button onClick={() => setActiveTab('sales')} className={`${activeTab === 'sales' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Sales Summary
                    </button>
                     <button onClick={() => setActiveTab('tax')} className={`${activeTab === 'tax' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        GST / Tax Summary
                    </button>
                </nav>
            </div>
            <div className="mt-6">
                {renderReport()}
            </div>
        </div>
    );
};

const ReceivablesReport: React.FC = () => (
    <div>
        <h3 className="text-lg font-medium text-gray-900">Receivables Aging Report</h3>
        <p className="mt-1 text-sm text-gray-500">This report is under construction.</p>
    </div>
);

const SalesReport: React.FC = () => (
    <div>
        <h3 className="text-lg font-medium text-gray-900">Sales Report by Period</h3>
        <p className="mt-1 text-sm text-gray-500">This report is under construction.</p>
    </div>
);

const TaxSummaryReport: React.FC = () => (
     <div>
        <h3 className="text-lg font-medium text-gray-900">Tax Summary Report</h3>
        <p className="mt-1 text-sm text-gray-500">This report is under construction.</p>
    </div>
);

export default ReportsPage;
