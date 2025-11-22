

export type LineItem = {
  name: string;
  quantity: number;
  price: number;
  hsn: string;
};

export type Seller = {
  _id?: string;
  name?: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  bank?: {
    name: string;
    branch: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
  companySealUrl?: string;
};

export type Invoice = {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  customerAddress: string;
  gstin: string;
  seller: Partial<Seller>;
  description: string;
  lineItems: LineItem[];
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Given' | 'Processing' | 'Received';
  date: string; // This is the issue date
  dueDate: string;
  issueDate?: string; // For backward compatibility or specific needs
};

export type PurchaseOrder = {
  _id?: string;
  id: string;
  vendor: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
};

export type Quotation = {
  _id: string;
  customer: string;
  amount: number;
  status: 'Sent' | 'Accepted' | 'Expired';
  expiryDate: string;
};

export type Client = {
  id: string;
  _id?: string; // from mongodb
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
};

export type MasterDescription = {
  id: string;
  title: string;
  content: string;
};


export const demoDescriptions = [
  'Standard refund policy applies.',
  'Service terms and conditions as agreed.',
  'Payment due upon receipt.',
  '30-day net payment terms.',
  'Hardware warranty included.',
  'Monthly support and maintenance contract.',
  'Consulting services rendered for Q4.',
  'Project Alpha - Milestone 2 payment.',
  'Annual software license renewal.',
  'All sales are final.',
];

// This data is now managed in Firestore, so we can remove the initial mock data.
export const invoices: Invoice[] = [];

export const purchaseOrders: PurchaseOrder[] = [
    {
      "id": "PO-001",
      "vendor": "Office Supplies Ltd.",
      "amount": 250.00,
      "status": "Approved",
      "date": "2024-05-10"
    },
    {
      "id": "PO-002",
      "vendor": "Cloud Services Inc.",
      "amount": 1200.00,
      "status": "Pending",
      "date": "2024-05-22"
    }
];

export const quotations: Quotation[] = [];

export const clients: Client[] = [];

export const masterDescriptions: MasterDescription[] = [
    { id: 'desc-001', title: 'Standard Refund Policy', content: 'All sales are final. Refunds are only provided for defective products reported within 7 days of receipt.' },
    { id: 'desc-002', title: 'Service Terms (30 Days)', content: 'Payment is due within 30 days of the invoice date. A late fee of 2% per month will be applied to overdue balances.' },
    { id: 'desc-003', title: 'Hardware Warranty', content: 'This product includes a 1-year limited hardware warranty covering manufacturing defects. It does not cover accidental damage.' },
];
