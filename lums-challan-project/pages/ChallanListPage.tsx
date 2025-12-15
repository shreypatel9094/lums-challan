import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Challan, ChallanStatus } from '../types';
import { PencilIcon, EyeIcon, PrinterIcon, XMarkIcon } from '../components/Icons';
import { formatDate, formatCurrency, getChallanTotals, getStatusColor, amountToWords } from '../utils/helpers';

// Declare global variables for the external libraries
declare const html2canvas: any;
declare const jspdf: any;

// Common component for displaying challan content
const ChallanContent: React.FC<{ challan: Challan }> = ({ challan }) => {
  const { getCustomerById, settings } = useAppContext();
  const customer = getCustomerById(challan.customerId);
  const totals = getChallanTotals(challan, settings.taxSettings.defaultGstRate);

  return (
    <div className="border-2 border-black p-4 text-sm text-black" style={{ fontFamily: "'Arial', sans-serif" }}>
      
      {/* Header */}
      <div className="text-center border-y-2 border-black py-2">
        <h1 className="text-2xl font-bold tracking-wider">Umiya Textiles</h1>
      </div>

      {/* Top Details */}
      <div className="grid grid-cols-2 border-b-2 border-black mt-1">
        <div className="border-r-2 border-black pr-2 py-1 space-y-1">
          <div className="flex justify-between"><strong>Serial no. of Delivery Challan:</strong> <span>{challan.challanNo}</span></div>
          <div className="border-t border-black pt-1"><strong>Whether Tax on Reverse Charge :</strong> No</div>
        </div>
        <div className="pl-2 py-1 space-y-1">
          <div className="flex justify-between"><strong>Mode of Transport:</strong> <span>BY ROAD</span></div>
          <div className="border-t border-black pt-1 flex justify-between"><strong>GR/Vehicle No:</strong> <span></span></div>
          <div className="border-t border-black pt-1 flex justify-between"><strong>Date:</strong> <span>{formatDate(challan.date)}</span></div>
          <div className="border-t border-black pt-1 flex justify-between"><strong>Place Of Supply:</strong> <span>DELHI</span></div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-2 border-b-2 border-black">
        <div className="border-r-2 border-black pr-2 py-1">
          <div className="bg-gray-100 font-bold p-1 -mx-2 -mt-1 border-b border-black">Details of Receiver (Company Address)</div>
          <div className="mt-2 min-h-[2.5rem] break-words"><strong>Name:</strong> {customer?.name}</div>
          <div className="mt-1 min-h-[3rem] break-words"><strong>Address:</strong> {customer?.address}</div>
          <div className="mt-1">
            <strong>Place of Supply:</strong> DELHI 
            <span className="ml-8"><strong>State code:</strong> 7</span>
          </div>
          <div className="mt-1 break-words"><strong>GSTIN/Unique ID:</strong> {customer?.gstNumber || 'N/A'}</div>
        </div>
        <div className="pl-2 py-1">
          <div className="bg-gray-100 font-bold p-1 -mx-2 -mt-1 border-b border-black">Details of Receiver (Delivery Address)</div>
          <div className="mt-2 min-h-[2.5rem] break-words"><strong>Name:</strong> {customer?.name}</div>
          <div className="mt-1 min-h-[3rem] break-words"><strong>Address:</strong> {customer?.address}</div>
          <div className="mt-1">
            <strong>Place of Supply:</strong> DELHI
            <span className="ml-8"><strong>State code:</strong> 7</span>
          </div>
          <div className="mt-1 break-words"><strong>GSTIN/Unique ID:</strong> {customer?.gstNumber || 'N/A'}</div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-r border-black p-2 font-bold w-12">S.No.</th>
            <th className="border-b-2 border-r border-black p-2 font-bold text-left">Description of Goods</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-24">HSN Code</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-16">Qty</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-16">Unit</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-24">Rate</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-24">Total</th>
            <th className="border-b-2 border-r border-black p-2 font-bold w-24">Discount</th>
            <th className="border-b-2 border-black p-2 font-bold w-32">Taxable value</th>
          </tr>
        </thead>
        <tbody>
          {challan.items.map((item, index) => {
            const itemTotal = item.quantity * item.unitPrice;
            const itemDiscountAmount = itemTotal * (item.discount / 100);
            const taxableValue = itemTotal - itemDiscountAmount;
            return (
              <tr key={item.id} className="align-top">
                <td className="border-r border-black p-2 text-center">{index + 1}</td>
                <td className="border-r border-black p-2">{item.description}</td>
                <td className="border-r border-black p-2 text-center">{item.hsnCode}</td>
                <td className="border-r border-black p-2 text-center">{item.quantity}</td>
                <td className="border-r border-black p-2 text-center">{item.unit}</td>
                <td className="border-r border-black p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="border-r border-black p-2 text-right">{formatCurrency(itemTotal)}</td>
                <td className="border-r border-black p-2 text-right">{formatCurrency(itemDiscountAmount)}</td>
                <td className="p-2 text-right">{formatCurrency(taxableValue)}</td>
              </tr>
            );
          })}
          {/* Filler rows to ensure table height */}
          {Array.from({ length: Math.max(0, 15 - challan.items.length) }).map((_, i) => (
            <tr key={`filler-${i}`} style={{height: '32px'}}>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={8} className="border-t-2 border-r border-black p-2 text-right">Total</td>
            <td className="border-t-2 border-black p-2 text-right">{formatCurrency(totals.subTotal - totals.totalDiscount)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer and Totals */}
      <div className="grid grid-cols-12 border-t-2 border-black">
        <div className="col-span-7 border-r-2 border-black p-2">
          <strong className="block">Invoice Total (In Words):</strong>
          <p className="capitalize break-words font-semibold min-h-[3rem]">{amountToWords(totals.roundedTotal)}</p>
          <strong className="block mt-4">E-way Bill no.</strong>
        </div>
        <div className="col-span-5">
          <div className="grid grid-cols-2">
            <div className="p-2 font-semibold">Taxable Amount</div>
            <div className="p-2 text-right font-semibold">{formatCurrency(totals.subTotal - totals.totalDiscount)}</div>
          </div>
          <div className="grid grid-cols-2 border-t border-black">
            <div className="p-2">CGST @ {(settings.taxSettings.defaultGstRate / 2).toFixed(2)}%</div>
            <div className="p-2 text-right">{formatCurrency(totals.totalCgst)}</div>
          </div>
          <div className="grid grid-cols-2 border-t border-black">
            <div className="p-2">SGST @ {(settings.taxSettings.defaultGstRate / 2).toFixed(2)}%</div>
            <div className="p-2 text-right">{formatCurrency(totals.totalSgst)}</div>
          </div>
          <div className="grid grid-cols-2 bg-gray-100 font-bold border-t-2 border-black">
            <div className="p-2">Grand Total</div>
            <div className="p-2 text-right">{formatCurrency(totals.roundedTotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ChallanViewModal: React.FC<{ challan: Challan | null; onClose: () => void }> = ({ challan, onClose }) => {
  if (!challan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-gray-100 w-full max-w-4xl mx-auto shadow-2xl relative rounded-lg flex flex-col my-8">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 bg-white rounded-full shadow-md z-10"
        >
          <XMarkIcon className="w-6 h-6"/>
        </button>
        
        <div className="p-4 sm:p-8 bg-white">
          <ChallanContent challan={challan} />
        </div>
        
        {/* Action Buttons */}
        <div className="no-print p-4 bg-gray-50 border-t rounded-b-lg flex justify-end">
          <button 
            onClick={onClose} 
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Print Modal Component
const ChallanPrintModal: React.FC<{ challan: Challan | null; onClose: () => void }> = ({ challan, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!challan) return null;

  const handleDownloadPdf = async () => {
    const input = document.getElementById('print-container-content');
    if (!input) {
      console.error("Print container not found!");
      return;
    }
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Challan-${challan.challanNo}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error generating the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-gray-100 w-full max-w-4xl mx-auto shadow-2xl relative rounded-lg flex flex-col my-8">
        <div id="print-container" className="p-4 sm:p-8 bg-white">
          <div id="print-container-content">
            <ChallanContent challan={challan} />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="no-print p-4 bg-gray-50 border-t rounded-b-lg flex justify-between items-center">
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6"/>
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold transition-colors"
            >
              <PrinterIcon className="w-5 h-5" />
              Print
            </button>
            <button 
              onClick={handleDownloadPdf} 
              disabled={isDownloading}
              className="flex items-center gap-2 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold transition-colors shadow-sm disabled:bg-primary-300 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallanListPage: React.FC<{onEditChallan: (challan: Challan) => void;}> = ({ onEditChallan }) => {
  const { challans, getCustomerById, getChallanBalance, settings } = useAppContext();
  
  const [filters, setFilters] = useState({
    status: '',
    customer: '',
    dateFrom: '',
    dateTo: '',
  });
  const [challanToPrint, setChallanToPrint] = useState<Challan | null>(null);
  const [challanToView, setChallanToView] = useState<Challan | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredChallans = useMemo(() => {
    return challans.filter(challan => {
      if (filters.status && challan.status !== filters.status) return false;
      if (filters.customer && challan.customerId !== filters.customer) return false;
      if (filters.dateFrom && challan.date < filters.dateFrom) return false;
      if (filters.dateTo && challan.date > filters.dateTo) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [challans, filters]);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Challan History</h2>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <select name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Statuses</option>
                {Object.values(ChallanStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="customer" value={filters.customer} onChange={handleFilterChange} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Customers</option>
                {useAppContext().customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Challan #</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">Balance</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallans.map(challan => {
                  const customer = getCustomerById(challan.customerId);
                  const { grandTotal } = getChallanTotals(challan, settings.taxSettings.defaultGstRate);
                  const balance = getChallanBalance(challan.id);

                  return (
                      <tr key={challan.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{challan.challanNo}</td>
                          <td className="px-6 py-4">{customer?.name || 'N/A'}</td>
                          <td className="px-6 py-4">{formatDate(challan.date)}</td>
                          <td className="px-6 py-4">{formatCurrency(grandTotal)}</td>
                          <td className="px-6 py-4 font-semibold text-red-600">{formatCurrency(balance)}</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(challan.status)}`}>
                                  {challan.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 flex items-center gap-4">
                              <button onClick={() => setChallanToPrint(challan)} className="text-gray-500 hover:text-primary-600" title="Print Challan">
                                <PrinterIcon className="w-5 h-5"/>
                              </button>
                              <button onClick={() => setChallanToView(challan)} className="text-blue-600 hover:text-blue-800" title="View Challan">
                                <EyeIcon className="w-5 h-5"/>
                              </button>
                              {challan.status === ChallanStatus.Draft && (
                                  <button onClick={() => onEditChallan(challan)} className="text-yellow-600 hover:text-yellow-800" title="Edit Challan">
                                    <PencilIcon className="w-5 h-5"/>
                                  </button>
                              )}
                          </td>
                      </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Print Modal */}
      <ChallanPrintModal challan={challanToPrint} onClose={() => setChallanToPrint(null)} />
      {/* View Modal */}
      <ChallanViewModal challan={challanToView} onClose={() => setChallanToView(null)} />
    </>
  );
};

export default ChallanListPage;