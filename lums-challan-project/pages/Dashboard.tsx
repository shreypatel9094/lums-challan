
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
// FIX: Imported `formatDate` which was missing.
import { getChallanTotals, formatCurrency, formatDate } from '../utils/helpers';
import { Challan, ChallanStatus } from '../types';
import { ChartPieIcon, CurrencyDollarIcon, DocumentDuplicateIcon, UserGroupIcon } from '../components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<{onNewChallan: () => void;}> = ({onNewChallan}) => {
  const { challans, customers, payments, getChallanBalance, getCustomerById } = useAppContext();

  const totalReceivables = challans
    .filter(c => c.status !== ChallanStatus.Paid && c.status !== ChallanStatus.Draft)
    .reduce((sum, challan) => sum + getChallanBalance(challan.id), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = challans
    .filter(c => c.date === today && c.status !== ChallanStatus.Draft)
    .reduce((sum, c) => sum + getChallanTotals(c, 18).grandTotal, 0);

  const salesData = challans
    .filter(c => c.status !== ChallanStatus.Draft)
    .reduce((acc, challan) => {
        const month = new Date(challan.date).toLocaleString('default', { month: 'short' });
        const year = new Date(challan.date).getFullYear();
        const key = `${month} ${year}`;
        const total = getChallanTotals(challan, 18).grandTotal;
        
        const existing = acc.find(item => item.name === key);
        if (existing) {
            existing.Sales += total;
        } else {
            acc.push({ name: key, Sales: total });
        }
        return acc;
    }, [] as {name: string; Sales: number}[]).slice(-6); 

  const recentChallans = [...challans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Receivables" value={formatCurrency(totalReceivables)} icon={CurrencyDollarIcon} color="bg-red-500" />
        <StatCard title="Today's Sales" value={formatCurrency(todaysSales)} icon={DocumentDuplicateIcon} color="bg-green-500" />
        <StatCard title="Total Customers" value={customers.length.toString()} icon={UserGroupIcon} color="bg-blue-500" />
        <StatCard title="Pending Challans" value={challans.filter(c => c.status === ChallanStatus.Finalized || c.status === ChallanStatus.PartiallyPaid).length.toString()} icon={ChartPieIcon} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value as number)}/>
                    <Tooltip formatter={(value) => formatCurrency(value as number)}/>
                    <Legend />
                    <Bar dataKey="Sales" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Challans</h3>
            <div className="space-y-4">
                {recentChallans.map(challan => {
                    const customer = getCustomerById(challan.customerId);
                    const total = getChallanTotals(challan, 18).grandTotal;
                    return (
                        <div key={challan.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{challan.challanNo}</p>
                                <p className="text-sm text-gray-500">{customer?.name || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">{formatCurrency(total)}</p>
                                <p className="text-sm text-gray-500">{formatDate(challan.date)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
