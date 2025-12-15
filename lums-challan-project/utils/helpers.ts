import { Challan, ChallanItem, Settings, ChallanStatus } from '../types';

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const getChallanTotals = (challan: Challan, defaultTaxRate: number) => {
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    challan.items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemDiscount = itemTotal * (item.discount / 100);
        const taxableAmount = itemTotal - itemDiscount;
        const itemTax = taxableAmount * ((item.taxRate || defaultTaxRate) / 100);

        subTotal += itemTotal;
        totalDiscount += itemDiscount;
        totalTax += itemTax;
    });

    const totalCgst = totalTax / 2;
    const totalSgst = totalTax / 2;
    const grandTotal = subTotal - totalDiscount + totalTax;
    const roundedTotal = Math.round(grandTotal);
    const roundOff = roundedTotal - grandTotal;

    return {
        subTotal,
        totalDiscount,
        totalTax,
        totalCgst,
        totalSgst,
        grandTotal,
        roundedTotal,
        roundOff,
    };
};

export const getStatusColor = (status: ChallanStatus) => {
    switch (status) {
        case ChallanStatus.Paid:
            return 'bg-green-100 text-green-800';
        case ChallanStatus.PartiallyPaid:
            return 'bg-yellow-100 text-yellow-800';
        case ChallanStatus.Finalized:
            return 'bg-blue-100 text-blue-800';
        case ChallanStatus.Overdue:
            return 'bg-red-100 text-red-800';
        case ChallanStatus.Draft:
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getNextChallanNumber = (settings: Settings): string => {
    const { prefix, nextNumber } = settings.challanNumbering;
    return `${prefix}${nextNumber}`;
};

// Function to convert amount to words (Indian currency system)
export const amountToWords = (amount: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n: number): string => {
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`;
        if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred ${numToWords(n % 100)}`;
        return '';
    };

    if (amount === 0) return 'Zero';

    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const remaining = Math.floor(amount % 1000);

    let words = '';
    if (crore > 0) words += `${numToWords(crore)} Crore `;
    if (lakh > 0) words += `${numToWords(lakh)} Lakh `;
    if (thousand > 0) words += `${numToWords(thousand)} Thousand `;
    if (remaining > 0) words += numToWords(remaining);

    return words.trim() + ' Only';
};