import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { formatCurrency, formatDate, getChallanTotals } from '../utils/helpers';

interface CustomerLedgerPageProps {
  customerId: string;
  onBack: () => void;
}

const CustomerLedgerPage: React.FC<CustomerLedgerPageProps> = ({ customerId, onBack }) => {
  const { 
    getCustomerById, 
    getChallansByCustomerId, 
    getPaymentsByCustomerId,
    settings 
  } = useAppContext();

  const customer = getCustomerById(customerId);
  const challans = getChallansByCustomerId(customerId);
  const payments = getPaymentsByCustomerId(customerId);

  if (!customer) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold text-red-600">Customer not found</h2>
        <button onClick={onBack} className="mt-4 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          Back to Customers
        </button>
      </div>
    );
  }

  // Combine challans and payments into a single transaction list
  const transactions = [
    ...challans.map(challan => ({
      date: challan.date,
      type: 'Challan',
      description: `Challan #${challan.challanNo}`,
      ref: challan.challanNo,
      debit: getChallanTotals(challan, settings.taxSettings.defaultGstRate).roundedTotal,
      credit: 0,
    })),
    ...payments.map(payment => ({
      date: payment.date,
      type: 'Payment',
      description: `Payment Received (${payment.method})`,
      ref: payment.challanId ? challans.find(c => c.id === payment.challanId)?.challanNo : (payment.reference || `PAY-${payment.id.slice(-4)}`),
      debit: 0,
      credit: payment.amount,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate running balance
  let currentBalance = customer.openingBalance;
  const transactionsWithBalance = transactions.map(tx => {
    currentBalance = currentBalance + tx.debit - tx.credit;
    return { ...tx, balance: currentBalance };
  });

  const totalBilled = challans.reduce((sum, c) => sum + getChallanTotals(c, settings.taxSettings.defaultGstRate).roundedTotal, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = customer.openingBalance + totalBilled - totalPaid;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{customer.name} - Ledger</h2>
          <p className="text-sm text-gray-500">{customer.address}</p>
          <p className="text-sm text-gray-500">Phone: {customer.phone}</p>
        </div>
        <button onClick={onBack} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          &larr; Back to List
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">Total Billed</p>
          <p className="text-xl font-bold text-blue-900">{formatCurrency(totalBilled)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">Total Paid</p>
          <p className="text-xl font-bold text-green-900">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800">Outstanding Balance</p>
          <p className="text-xl font-bold text-red-900">{formatCurrency(outstandingBalance)}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Particulars</th>
              <th scope="col" className="px-6 py-3">Ref #</th>
              <th scope="col" className="px-6 py-3 text-right">Debit</th>
              <th scope="col" className="px-6 py-3 text-right">Credit</th>
              <th scope="col" className="px-6 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 border-b">
              <td className="px-6 py-4">{formatDate(customer.createdAt)}</td>
              <td colSpan={4} className="px-6 py-4 font-medium text-gray-800 italic">Opening Balance</td>
              <td className="px-6 py-4 text-right font-medium text-gray-800">{formatCurrency(customer.openingBalance)}</td>
            </tr>
            {transactionsWithBalance.map((tx, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{formatDate(tx.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                <td className="px-6 py-4">{tx.ref}</td>
                <td className="px-6 py-4 text-right">{tx.debit > 0 ? formatCurrency(tx.debit) : '-'}</td>
                <td className="px-6 py-4 text-right text-green-600">{tx.credit > 0 ? formatCurrency(tx.credit) : '-'}</td>
                <td className="px-6 py-4 text-right font-semibold">{formatCurrency(tx.balance)}</td>
              </tr>
            ))}
             <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="px-6 py-4 text-right text-gray-900">Closing Balance</td>
                <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(outstandingBalance)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerLedgerPage;