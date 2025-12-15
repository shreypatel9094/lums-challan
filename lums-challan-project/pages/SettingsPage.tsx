
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Settings } from '../types';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      companyProfile: { ...prev.companyProfile, [name]: value },
    }));
  };
  
  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      taxSettings: { ...prev.taxSettings, [name]: parseFloat(value) || 0 },
    }));
  };

  const handleNumberingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      challanNumbering: { ...prev.challanNumbering, [name]: name === 'nextNumber' ? parseInt(value, 10) || 0 : value },
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Company Profile */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" name="name" value={localSettings.companyProfile.name} onChange={handleCompanyChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" value={localSettings.companyProfile.phone} onChange={handleCompanyChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" value={localSettings.companyProfile.address} onChange={handleCompanyChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">GST Number</label>
            <input type="text" name="gstNumber" value={localSettings.companyProfile.gstNumber} onChange={handleCompanyChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
      </div>

      {/* Tax & Numbering Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax Settings</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">Default GST Rate (%)</label>
                <input type="number" name="defaultGstRate" value={localSettings.taxSettings.defaultGstRate} onChange={handleTaxChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Challan Numbering</h2>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Prefix</label>
                    <input type="text" name="prefix" value={localSettings.challanNumbering.prefix} onChange={handleNumberingChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Next Number</label>
                    <input type="number" name="nextNumber" value={localSettings.challanNumbering.nextNumber} onChange={handleNumberingChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button onClick={handleSave} className="py-2 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">Save Settings</button>
      </div>
    </div>
  );
};

export default SettingsPage;
