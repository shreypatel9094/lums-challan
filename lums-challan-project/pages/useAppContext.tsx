
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Customer, Challan, Payment, Settings, ChallanItem, ChallanStatus } from '../types';
import { MOCK_CUSTOMERS, MOCK_CHALLANS, MOCK_PAYMENTS, MOCK_SETTINGS } from '../data/mockData';
import { getChallanTotals, getNextChallanNumber } from '../utils/helpers';


interface AppContextType {
  customers: Customer[];
  challans: Challan[];
  payments: Payment[];
  settings: Settings;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addChallan: (challan: Omit<Challan, 'id' | 'createdAt' | 'challanNo'>) => void;
  updateChallan: (challan: Challan) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdBy'>) => void;
  updateSettings: (newSettings: Settings) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getChallansByCustomerId: (id: string) => Challan[];
  getPaymentsByCustomerId: (id: string) => Payment[];
  getChallanBalance: (challanId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [challans, setChallans] = useState<Challan[]>(MOCK_CHALLANS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };
  
  const addChallan = (challanData: Omit<Challan, 'id' | 'createdAt' | 'challanNo'>) => {
    const challanNo = getNextChallanNumber(settings);
    const newChallan: Challan = {
      ...challanData,
      id: `CHLN-${Date.now()}`,
      challanNo,
      createdAt: new Date().toISOString(),
    };
    setChallans(prev => [...prev, newChallan]);
    setSettings(prev => ({
        ...prev,
        challanNumbering: { ...prev.challanNumbering, nextNumber: prev.challanNumbering.nextNumber + 1 }
    }));
  };

  const updateChallan = (updatedChallan: Challan) => {
    setChallans(prev => prev.map(c => c.id === updatedChallan.id ? updatedChallan : c));
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'createdBy'>) => {
    const newPayment: Payment = {
        ...paymentData,
        id: `PAY-${Date.now()}`,
        createdBy: 'Admin',
    };
    setPayments(prev => [...prev, newPayment]);

    // Update challan status if payment is for a specific challan
    if (newPayment.challanId) {
        const challan = challans.find(c => c.id === newPayment.challanId);
        if (challan) {
            const balance = getChallanBalance(challan.id) - newPayment.amount; // new balance
            let newStatus = challan.status;
            if (balance <= 0) {
                newStatus = ChallanStatus.Paid;
            } else {
                newStatus = ChallanStatus.PartiallyPaid;
            }
            updateChallan({...challan, status: newStatus});
        }
    }
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };
  
  const getCustomerById = (id: string) => customers.find(c => c.id === id);
  const getChallansByCustomerId = (id: string) => challans.filter(c => c.customerId === id);
  const getPaymentsByCustomerId = (id: string) => payments.filter(p => p.customerId === id);
  
  const getChallanBalance = useMemo(() => (challanId: string): number => {
    const challan = challans.find(c => c.id === challanId);
    if (!challan) return 0;

    const { grandTotal } = getChallanTotals(challan, settings.taxSettings.defaultGstRate);
    const totalPaid = payments
      .filter(p => p.challanId === challanId)
      .reduce((sum, p) => sum + p.amount, 0);

    return grandTotal - totalPaid;
  }, [challans, payments, settings]);


  const value = {
    customers,
    challans,
    payments,
    settings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addChallan,
    updateChallan,
    addPayment,
    updateSettings,
    getCustomerById,
    getChallansByCustomerId,
    getPaymentsByCustomerId,
    getChallanBalance
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
