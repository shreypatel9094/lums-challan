import React, { useState } from 'react';
import { Challan } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { formatCurrency, formatDate, getChallanTotals, amountToWords } from '../utils/helpers';
import { PrinterIcon, XMarkIcon, ArrowDownTrayIcon } from './Icons';

// Declare global variables for the external libraries
declare const html2canvas: any;
declare const jspdf: any;


interface ChallanPrintViewProps {
  challan: Challan | null;
  onClose: () => void;
}

const ChallanPrintView: React.FC<ChallanPrintViewProps> = ({ challan, onClose }) => {
  const { getCustomerById, settings } = useAppContext();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!challan) return null;

  const customer = getCustomerById(challan.customerId);
  const totals = getChallanTotals(challan, settings.taxSettings.defaultGstRate);

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
              logging: false,
              letterRendering: true,
              allowTaint: true,
          });
          const imgData = canvas.toDataURL('image/png');
          
          // Create PDF with proper dimensions
          const pdf = new jspdf.jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
          });

          // Calculate dimensions for proper fit
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          // Save with proper filename
          pdf.save(`Challan-${challan.challanNo}.pdf`);

      } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Sorry, there was an error generating the PDF. Please try again.");
      } finally {
          setIsDownloading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-gray-100 w-full max-w-4xl mx-auto shadow-2xl relative rounded-lg flex flex-col my-8">
        
        <div id="print-container" className="p-4 sm:p-8 bg-white">
            <div id="print-container-content" className="border-2 border-black p-4 text-sm text-black" style={{ fontFamily: "'Arial', sans-serif" }}>
                
                {/* Header */}
                <div className="text-center border-y-2 border-black py-2">
                    <h1 className="text-2xl font-bold tracking-wider">Umiya Textiles</h1>
                </div>

                {/* Top Details */}
                <div className="grid grid-cols-2 border-b-2 border-black mt-1">
                    <div className="border-r-2 border-black pr-2 py-1 space-y-1">
                        <div className="flex justify-between"><strong>Serial no. of Delivery Challan:</strong> <span>{challan.challanNo}</span></div>
                        <div className="border-t border-black pt-1"><strong>Whether Tax on Reverse Charge :</strong> <span>{challan.reverseCharge}</span></div>
                    </div>
                    <div className="pl-2 py-1 space-y-1">
                        <div className="flex justify-between"><strong>Mode of Transport:</strong> <span>{challan.modeOfTransport}</span></div>
                        <div className="border-t border-black pt-1 flex justify-between"><strong>GR/Vehicle No:</strong> <span>{challan.grVehicleNo || ''}</span></div>
                        <div className="border-t border-black pt-1 flex justify-between"><strong>Date:</strong> <span>{formatDate(challan.date)}</span></div>
                        <div className="border-t border-black pt-1 flex justify-between"><strong>Place Of Supply:</strong> <span>{challan.placeOfSupply}</span></div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 border-b-2 border-black">
                    <div className="border-r-2 border-black pr-2 py-1">
                        <div className="bg-gray-100 font-bold p-1 -mx-2 -mt-1 border-b border-black">Details of Receiver (Company Address)</div>
                        <div className="mt-2 min-h-[2.5rem] break-words"><strong>Name:</strong> {customer?.name}</div>
                        <div className="mt-1 min-h-[3rem] break-words"><strong>Address:</strong> {customer?.address}</div>
                        <div className="mt-1">
                            <strong>Place of Supply:</strong> {challan.placeOfSupply} 
                            <span className="ml-8"><strong>State code:</strong> 7</span>
                        </div>
                        <div className="mt-1 break-words"><strong>GSTIN/Unique ID:</strong> {customer?.gstNumber || 'N/A'}</div>
                    </div>
                    <div className="pl-2 py-1">
                        <div className="bg-gray-100 font-bold p-1 -mx-2 -mt-1 border-b border-black">Details of Receiver (Delivery Address)</div>
                        <div className="mt-2 min-h-[2.5rem] break-words"><strong>Name:</strong> {challan.deliveryAddress.name}</div>
                        <div className="mt-1 min-h-[3rem] break-words"><strong>Address:</strong> {challan.deliveryAddress.address}</div>
                        <div className="mt-1">
                            <strong>Place of Supply:</strong> {challan.deliveryAddress.placeOfSupply}
                            <span className="ml-8"><strong>State code:</strong> {challan.deliveryAddress.stateCode}</span>
                        </div>
                        <div className="mt-1 break-words"><strong>GSTIN/Unique ID:</strong> {challan.deliveryAddress.gstin || 'N/A'}</div>
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
                                    <td className="border-r border-black p-2 text-center">{item.hsnCode || ''}</td>
                                    <td className="border-r border-black p-2 text-center">{item.quantity}</td>
                                    <td className="border-r border-black p-2 text-center">{item.unit}</td>
                                    <td className="border-r border-black p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                    <td className="border-r border-black p-2 text-right">{formatCurrency(itemTotal)}</td>
                                    <td className="border-r border-black p-2 text-right">{item.discount > 0 ? `${item.discount}%` : ''}</td>
                                    <td className="p-2 text-right">{formatCurrency(taxableValue)}</td>
                                </tr>
                            );
                        })}
                        {/* Filler rows to ensure table height */}
                        {Array.from({ length: Math.max(0, 15 - challan.items.length) }).map((_, i) => (
                          <tr key={`filler-${i}`} style={{height: '32px'}}>
                              <td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td className="border-r border-black"></td><td></td>
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
                        <p className="break-words">{challan.ewayBillNo || ''}</p>
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
        </div>
        
        {/* Action Buttons */}
        <div className="no-print p-4 bg-gray-50 border-t rounded-b-lg flex justify-between items-center">
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                <XMarkIcon className="w-6 h-6"/>
            </button>
            <div className="flex gap-4">
                 <button onClick={() => window.print()} className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold transition-colors">
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
                            <ArrowDownTrayIcon className="w-5 h-5" />
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

export default ChallanPrintView;