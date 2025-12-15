
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { PaymentMethod } from '../types';
import { formatDate, formatCurrency } from '../utils/helpers';

const PaymentsPage: React.FC = () => {
  const { payments, customers, challans, addPayment, getCustomerById } = useAppContext();
  const [newPayment, setNewPayment] = useState({
    customerId: '',
    challanId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: PaymentMethod.UPI,
    reference: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.customerId || newPayment.amount <= 0) {
      alert("Please select a customer and enter a valid amount.");
      return;
    }
    addPayment(newPayment);
    // Reset form
    setNewPayment({
      customerId: '',
      challanId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: PaymentMethod.UPI,
      reference: '',
    });
  };

  const availableChallans = newPayment.customerId 
    ? challans.filter(c => c.customerId === newPayment.customerId)
    : [];
  
  const sortedPayments = [...payments].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Record Payment Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Record New Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select name="customerId" value={newPayment.customerId} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply to Challan (Optional)</label>
            <select name="challanId" value={newPayment.challanId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" disabled={!newPayment.customerId}>
              <option value="">General Payment</option>
              {availableChallans.map(c => <option key={c.id} value={c.id}>{c.challanNo}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" name="amount" value={newPayment.amount} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input type="date" name="date" value={newPayment.date} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select name="method" value={newPayment.method} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference / Notes</label>
            <input type="text" name="reference" value={newPayment.reference} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">Record Payment</button>
        </form>
      </div>

      {/* Payment History */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Method</th>
                <th scope="col" className="px-6 py-3">Reference</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map(payment => {
                const customer = getCustomerById(payment.customerId);
                return (
                  <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{formatDate(payment.date)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{customer?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">{payment.method}</td>
                    <td className="px-6 py-4">{payment.reference || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
