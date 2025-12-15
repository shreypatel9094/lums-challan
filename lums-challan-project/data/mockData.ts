import { Customer, Challan, Payment, Settings, ChallanStatus, PaymentMethod } from '../types';

export const MOCK_SETTINGS: Settings = {
    companyProfile: {
        id: 'COMP-1',
        name: 'Umiya Textiles',
        address: '123 Industrial Area, City, State 12345',
        phone: '+91 98765 43210',
        gstNumber: '29ABCDE1234F1Z5',
        logoUrl: 'https://picsum.photos/seed/lumslogo/100/100',
    },
    taxSettings: {
        defaultGstRate: 18,
    },
    challanNumbering: {
        prefix: 'LUMS-',
        nextNumber: 1005,
    },
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1',
    name: 'Reliable Industries',
    phone: '9876543210',
    address: '456 Tech Park, Bangalore',
    gstNumber: '29AAAAA0000A1Z5',
    openingBalance: 0,
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'CUST-2',
    name: 'Pioneer Steel',
    phone: '8765432109',
    address: '789 Metal Street, Mumbai',
    gstNumber: '27BBBBB1111B1Z5',
    openingBalance: 5000,
    createdAt: '2023-02-20T11:30:00Z',
  },
  {
    id: 'CUST-3',
    name: 'Future Fabricators',
    phone: '7654321098',
    address: '101 Innovation Blvd, Pune',
    openingBalance: 0,
    createdAt: '2023-03-10T14:00:00Z',
  },
];

export const MOCK_CHALLANS: Challan[] = [
  {
    id: 'CHLN-1',
    challanNo: 'LUMS-1001',
    customerId: 'CUST-1',
    date: '2023-10-25',
    dueDate: '2023-11-24',
    status: ChallanStatus.Paid,
    modeOfTransport: 'BY ROAD',
    grVehicleNo: 'DL12345',
    placeOfSupply: 'DELHI',
    reverseCharge: 'No',
    deliveryAddress: {
      name: 'Reliable Industries',
      address: '456 Tech Park, Bangalore',
      placeOfSupply: 'DELHI',
      stateCode: '7',
      gstin: '29AAAAA0000A1Z5'
    },
    ewayBillNo: '',
    items: [
      { id: 'CI-1', description: 'CNC Milling Service', hsnCode: '998729', quantity: 10, unit: 'hours', unitPrice: 1500, taxRate: 18, discount: 5 },
      { id: 'CI-2', description: 'Lathe Work', hsnCode: '998729', quantity: 5, unit: 'hours', unitPrice: 800, taxRate: 18, discount: 0 },
    ],
    notes: 'Urgent delivery requested.',
    createdBy: 'Admin',
    createdAt: '2023-10-25T09:00:00Z',
  },
  {
    id: 'CHLN-2',
    challanNo: 'LUMS-1002',
    customerId: 'CUST-2',
    date: '2023-10-28',
    dueDate: '2023-11-27',
    status: ChallanStatus.PartiallyPaid,
    modeOfTransport: 'BY ROAD',
    grVehicleNo: 'MH67890',
    placeOfSupply: 'DELHI',
    reverseCharge: 'No',
    deliveryAddress: {
      name: 'Pioneer Steel',
      address: '789 Metal Street, Mumbai',
      placeOfSupply: 'DELHI',
      stateCode: '7',
      gstin: '27BBBBB1111B1Z5'
    },
    ewayBillNo: '',
    items: [
      { id: 'CI-3', description: 'Sheet Metal Bending', hsnCode: '998723', quantity: 100, unit: 'pcs', unitPrice: 50, taxRate: 18, discount: 0 },
      { id: 'CI-4', description: 'Welding', hsnCode: '998724', quantity: 20, unit: 'joins', unitPrice: 250, taxRate: 18, discount: 0 },
    ],
    createdBy: 'Admin',
    createdAt: '2023-10-28T14:30:00Z',
  },
  {
    id: 'CHLN-3',
    challanNo: 'LUMS-1003',
    customerId: 'CUST-1',
    date: '2023-11-05',
    dueDate: '2023-12-05',
    status: ChallanStatus.Finalized,
    modeOfTransport: 'BY ROAD',
    grVehicleNo: 'KA12345',
    placeOfSupply: 'DELHI',
    reverseCharge: 'No',
    deliveryAddress: {
      name: 'Reliable Industries',
      address: '456 Tech Park, Bangalore',
      placeOfSupply: 'DELHI',
      stateCode: '7',
      gstin: '29AAAAA0000A1Z5'
    },
    ewayBillNo: '',
    items: [
      { id: 'CI-5', description: 'Grinding and Finishing', hsnCode: '998725', quantity: 50, unit: 'sq.ft', unitPrice: 120, taxRate: 18, discount: 10 },
    ],
    createdBy: 'Admin',
    createdAt: '2023-11-05T11:00:00Z',
  },
  {
    id: 'CHLN-4',
    challanNo: 'LUMS-1004',
    customerId: 'CUST-3',
    date: '2023-11-10',
    dueDate: '2023-12-10',
    status: ChallanStatus.Draft,
    modeOfTransport: 'BY ROAD',
    grVehicleNo: '',
    placeOfSupply: 'DELHI',
    reverseCharge: 'No',
    deliveryAddress: {
      name: 'Future Fabricators',
      address: '101 Innovation Blvd, Pune',
      placeOfSupply: 'DELHI',
      stateCode: '7',
      gstin: ''
    },
    ewayBillNo: '',
    items: [
      { id: 'CI-6', description: '3D Printing Prototype', hsnCode: '998726', quantity: 2, unit: 'pcs', unitPrice: 5000, taxRate: 18, discount: 0 },
    ],
    notes: 'Awaiting final design approval.',
    createdBy: 'Admin',
    createdAt: '2023-11-10T16:00:00Z',
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PAY-1',
    challanId: 'CHLN-1',
    customerId: 'CUST-1',
    amount: 21977.50,
    date: '2023-11-01',
    method: PaymentMethod.BankTransfer,
    reference: 'REF12345',
    createdBy: 'Admin',
  },
  {
    id: 'PAY-2',
    challanId: 'CHLN-2',
    customerId: 'CUST-2',
    amount: 5000,
    date: '2023-11-10',
    method: PaymentMethod.UPI,
    reference: 'UPI98765',
    createdBy: 'Admin',
  },
  {
    id: 'PAY-3',
    customerId: 'CUST-2',
    amount: 5000,
    date: '2023-10-15',
    method: PaymentMethod.Cash,
    reference: 'Advance for next job',
    createdBy: 'Admin',
  },
];