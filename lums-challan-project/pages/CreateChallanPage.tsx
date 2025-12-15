import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Challan, ChallanItem, Customer, ChallanStatus } from '../types';
import { getChallanTotals, formatCurrency } from '../utils/helpers';
import { TrashIcon } from '../components/Icons';

const getNewChallanItem = (): ChallanItem => ({
  id: `ITEM-${Date.now()}`,
  description: '',
  hsnCode: '',
  quantity: 1,
  unit: 'pcs',
  unitPrice: 0,
  taxRate: 18,
  discount: 0,
});

// Default values for new challans
const getDefaultChallanValues = () => ({
  modeOfTransport: 'BY ROAD',
  grVehicleNo: '',
  placeOfSupply: 'DELHI',
  reverseCharge: 'No',
  deliveryAddress: {
    name: '',
    address: '',
    placeOfSupply: 'DELHI',
    stateCode: '7',
    gstin: ''
  },
  ewayBillNo: ''
});

const CreateChallanPage: React.FC<{ challanToEdit: Challan | null; onSave: () => void; }> = ({ challanToEdit, onSave }) => {
  const { customers, settings, addChallan, updateChallan } = useAppContext();
  const [challan, setChallan] = useState<Omit<Challan, 'id' | 'createdAt' | 'challanNo'>>({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ChallanStatus.Draft,
    items: [getNewChallanItem()],
    notes: '',
    createdBy: 'Admin',
    ...getDefaultChallanValues()
  });
  
  useEffect(() => {
    if (challanToEdit) {
      setChallan({
        ...challanToEdit,
        // We don't want to copy the id, createdAt, or challanNo
        customerId: challanToEdit.customerId,
        date: challanToEdit.date,
        dueDate: challanToEdit.dueDate,
        status: challanToEdit.status,
        items: challanToEdit.items,
        notes: challanToEdit.notes || '',
        createdBy: challanToEdit.createdBy
      });
    } else {
        setChallan({
            customerId: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: ChallanStatus.Draft,
            items: [getNewChallanItem()],
            notes: '',
            createdBy: 'Admin',
            ...getDefaultChallanValues()
        })
    }
  }, [challanToEdit]);


  const handleChallanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties like deliveryAddress.name
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setChallan(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setChallan(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index: number, field: keyof ChallanItem, value: string | number) => {
    const newItems = [...challan.items];
    const item = { ...newItems[index] } as any;

    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate' || field === 'discount') {
        item[field] = parseFloat(value as string) || 0;
    } else {
        item[field] = value;
    }

    newItems[index] = item;
    setChallan(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setChallan(prev => ({ ...prev, items: [...prev.items, getNewChallanItem()] }));
  };

  const removeItem = (index: number) => {
    const newItems = challan.items.filter((_, i) => i !== index);
    setChallan(prev => ({ ...prev, items: newItems }));
  };
  
  const handleSave = (status: ChallanStatus) => {
    const challanWithStatus = {...challan, status};
    if (challanToEdit) {
      updateChallan(challanWithStatus as Challan);
    } else {
      addChallan(challanWithStatus);
    }
    onSave();
  };

  const totals = useMemo(() => getChallanTotals(challan as Challan, settings.taxSettings.defaultGstRate), [challan, settings]);

  // Update delivery address when customer changes
  useEffect(() => {
    if (challan.customerId) {
      const customer = customers.find(c => c.id === challan.customerId);
      if (customer) {
        setChallan(prev => ({
          ...prev,
          deliveryAddress: {
            ...prev.deliveryAddress,
            name: customer.name,
            address: customer.address,
            gstin: customer.gstNumber || ''
          }
        }));
      }
    }
  }, [challan.customerId, customers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{challanToEdit ? `Edit Challan #${(challanToEdit as Challan).challanNo}` : 'Create New Challan'}</h2>
                <p className="text-sm text-gray-500">All fields are required</p>
            </div>
            {challanToEdit && <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">{challanToEdit.status}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Dates */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <select name="customerId" value={challan.customerId} onChange={handleChallanChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Challan Date</label>
                    <input type="date" name="date" value={challan.date} onChange={handleChallanChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" name="dueDate" value={challan.dueDate} onChange={handleChallanChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                </div>
            </div>
          </div>

          {/* Transport & Supply Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transport & Supply Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode of Transport</label>
                <input type="text" name="modeOfTransport" value={challan.modeOfTransport} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GR/Vehicle No.</label>
                <input type="text" name="grVehicleNo" value={challan.grVehicleNo} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Place of Supply</label>
                <input type="text" name="placeOfSupply" value={challan.placeOfSupply} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Whether Tax on Reverse Charge</label>
                <select name="reverseCharge" value={challan.reverseCharge} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="deliveryAddress.name" value={challan.deliveryAddress.name} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GSTIN/Unique ID</label>
                <input type="text" name="deliveryAddress.gstin" value={challan.deliveryAddress.gstin} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="deliveryAddress.address" value={challan.deliveryAddress.address} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Place of Supply</label>
                <input type="text" name="deliveryAddress.placeOfSupply" value={challan.deliveryAddress.placeOfSupply} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State Code</label>
                <input type="text" name="deliveryAddress.stateCode" value={challan.deliveryAddress.stateCode} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Items</h3>
              <button onClick={addItem} className="text-primary-600 font-semibold hover:text-primary-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Description</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN/SAC</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc %</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {challan.items.map((item, index) => (
                            <tr key={item.id}>
                                <td><input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td><input type="text" value={item.hsnCode || ''} onChange={e => handleItemChange(index, 'hsnCode', e.target.value)} className="w-24 p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-20 p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td><input type="text" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} className="w-20 p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td><input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-24 p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td><input type="number" value={item.discount} onChange={e => handleItemChange(index, 'discount', e.target.value)} className="w-20 p-2 border-none focus:ring-0 text-gray-900"/></td>
                                <td className="p-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.quantity * item.unitPrice * (1 - item.discount / 100))}</td>
                                <td><button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-5 h-5"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">E-way Bill</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-way Bill No.</label>
              <input type="text" name="ewayBillNo" value={challan.ewayBillNo} onChange={handleChallanChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="space-y-3 text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subTotal)}</span></div>
                <div className="flex justify-between"><span>Discount</span><span className="text-green-600">- {formatCurrency(totals.totalDiscount)}</span></div>
                <div className="flex justify-between"><span>CGST</span><span>+ {formatCurrency(totals.totalCgst)}</span></div>
                <div className="flex justify-between"><span>SGST</span><span>+ {formatCurrency(totals.totalSgst)}</span></div>
                <div className="flex justify-between"><span>Round Off</span><span>{formatCurrency(totals.roundOff)}</span></div>
                <hr className="my-2"/>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>{formatCurrency(totals.roundedTotal)}</span>
                </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes / Terms & Conditions</label>
                    <textarea name="notes" value={challan.notes || ''} onChange={handleChallanChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                </div>
                <div className="flex flex-col space-y-2">
                    <button onClick={() => handleSave(ChallanStatus.Draft)} className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300">Save as Draft</button>
                    <button onClick={() => handleSave(ChallanStatus.Finalized)} className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">Finalize Challan</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallanPage;