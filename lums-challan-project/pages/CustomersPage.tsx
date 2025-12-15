import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Customer } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '../components/Icons';
import { formatCurrency, formatDate } from '../utils/helpers';

// CustomerModal component defined outside CustomersPage
const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt'> | Customer) => void;
  customerToEdit: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
  const [customer, setCustomer] = useState<Omit<Customer, 'id' | 'createdAt'>>({
    name: '', phone: '', address: '', gstNumber: '', openingBalance: 0,
  });

  React.useEffect(() => {
    if (customerToEdit) {
      setCustomer(customerToEdit);
    } else {
      setCustomer({ name: '', phone: '', address: '', gstNumber: '', openingBalance: 0 });
    }
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: name === 'openingBalance' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={customer.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" value={customer.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea name="address" value={customer.address} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Number (Optional)</label>
            <input type="text" name="gstNumber" value={customer.gstNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Opening Balance</label>
            <input type="number" name="openingBalance" value={customer.openingBalance} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CustomersPageProps {
  onViewCustomer: (customerId: string) => void;
}

// Main CustomersPage component
const CustomersPage: React.FC<CustomersPageProps> = ({ onViewCustomer }) => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleOpenModal = (customer: Customer | null = null) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCustomerToEdit(null);
  };
  
  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'> | Customer) => {
    if ('id' in customerData) {
      updateCustomer(customerData);
    } else {
      addCustomer(customerData);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
            <PlusIcon className="w-5 h-5"/>
            Add Customer
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Contact</th>
              <th scope="col" className="px-6 py-3">Joined On</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{formatDate(customer.createdAt)}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <button 
                      onClick={() => onViewCustomer(customer.id)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-xs font-semibold shadow-sm"
                      title="View customer ledger"
                  >
                      <EyeIcon className="w-4 h-4"/>
                      View Ledger
                  </button>
                  <button 
                      onClick={() => handleOpenModal(customer)} 
                      className="p-2 text-gray-500 hover:text-yellow-600 rounded-md hover:bg-gray-50"
                      title="Edit customer"
                  >
                      <PencilIcon className="w-5 h-5"/>
                  </button>
                  <button 
                      onClick={() => deleteCustomer(customer.id)} 
                      className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-50"
                      title="Delete customer"
                  >
                      <TrashIcon className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />
    </div>
  );
};

export default CustomersPage;