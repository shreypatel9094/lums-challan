export type Page = 'dashboard' | 'customers' | 'challans' | 'create-challan' | 'payments' | 'reports' | 'settings' | 'customer-ledger';

export enum Role {
  Admin = 'admin',
  Accountant = 'accountant',
  Viewer = 'viewer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Company {
  id:string;
  name: string;
  address: string;
  phone: string;
  gstNumber?: string;
  logoUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  gstNumber?: string;
  openingBalance: number;
  createdAt: string;
}

export enum ChallanStatus {
  Draft = 'Draft',
  Finalized = 'Finalized',
  Paid = 'Paid',
  PartiallyPaid = 'Partially Paid',
  Overdue = 'Overdue',
}

export interface ChallanItem {
  id: string;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number; // as a percentage
}

// Extended interface for editable PDF details
export interface ChallanPdfDetails {
  modeOfTransport: string;
  grVehicleNo: string;
  placeOfSupply: string;
  reverseCharge: string;
  deliveryAddress: {
    name: string;
    address: string;
    placeOfSupply: string;
    stateCode: string;
    gstin: string;
  };
  ewayBillNo: string;
}

export interface Challan extends ChallanPdfDetails {
  id: string;
  challanNo: string;
  customerId: string;
  date: string;
  dueDate: string;
  status: ChallanStatus;
  items: ChallanItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export enum PaymentMethod {
  Cash = 'Cash',
  BankTransfer = 'Bank Transfer',
  UPI = 'UPI',
}

export interface Payment {
  id: string;
  challanId?: string;
  customerId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string;
  createdBy: string;
}

export interface Settings {
    companyProfile: Company;
    taxSettings: {
        defaultGstRate: number;
    };
    challanNumbering: {
        prefix: string;
        nextNumber: number;
    };
}