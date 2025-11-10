export type LineItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  customer: string;
  email: string;
  customerAddress: string;
  gstin: string;
  description: string;
  lineItems: LineItem[];
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  dueDate: string;
};

export type PurchaseOrder = {
  id: string;
  vendor: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
};

export type Quotation = {
  id: string;
  customer: string;
  amount: number;
  status: 'Sent' | 'Accepted' | 'Expired';
  expiryDate: string;
};

export const invoices: Invoice[] = [
  { 
    id: 'INV-001', 
    customer: 'KeeRa Innovations', 
    email: 'keera@innovations.com',
    customerAddress: '123 Tech Park, Silicon Valley',
    gstin: '29ABCDE1234F1Z5',
    description: 'Web Development Services',
    lineItems: [{ name: 'Frontend Development', quantity: 1, price: 250.0 }],
    amount: 250.0, 
    status: 'Paid', 
    date: '2023-10-23',
    dueDate: '2023-11-22'
  },
  { 
    id: 'INV-002', 
    customer: 'Solutions Inc.', 
    email: 'contact@solutions.inc',
    customerAddress: '456 Business Blvd, Metropolis',
    gstin: '27FGHIJ5678K1Z4',
    description: 'Consulting Services',
    lineItems: [{ name: 'Strategy Session', quantity: 1, price: 150.0 }],
    amount: 150.0, 
    status: 'Pending', 
    date: '2023-10-24',
    dueDate: '2023-11-23'
  },
  { 
    id: 'INV-003', 
    customer: 'Tech Corp', 
    email: 'info@techcorp.com',
    customerAddress: '789 Innovation Dr, Technocity',
    gstin: '36LMNOP9012Q1Z3',
    description: 'Software License',
    lineItems: [{ name: 'Pro License', quantity: 1, price: 350.0 }],
    amount: 350.0, 
    status: 'Paid', 
    date: '2023-10-15',
    dueDate: '2023-11-14'
  },
  { 
    id: 'INV-004', 
    customer: 'Global Services', 
    email: 'support@globalservices.com',
    customerAddress: '101 World Ave, Capital City',
    gstin: '24RSTUV3456W1Z2',
    description: 'Monthly Retainer',
    lineItems: [{ name: 'Support Contract', quantity: 1, price: 450.0 }],
    amount: 450.0, 
    status: 'Overdue', 
    date: '2023-09-01',
    dueDate: '2023-10-01'
  },
  { 
    id: 'INV-005', 
    customer: 'KeeRa Innovations', 
    email: 'keera@innovations.com',
    customerAddress: '123 Tech Park, Silicon Valley',
    gstin: '29ABCDE1234F1Z5',
    description: 'Project Milestone 1',
    lineItems: [{ name: 'UI/UX Design', quantity: 1, price: 550.0 }],
    amount: 550.0, 
    status: 'Pending', 
    date: '2023-10-28',
    dueDate: '2023-11-27'
  },
  { 
    id: 'INV-006', 
    customer: 'Alpha Co', 
    email: 'contact@alphaco.com',
    customerAddress: '210 First St, Alphaville',
    gstin: '22XYZAB7890C1Z1',
    description: 'Hardware purchase',
    lineItems: [{ name: 'Wireless Mouse', quantity: 1, price: 50.0 }],
    amount: 50.0, 
    status: 'Paid', 
    date: '2023-10-29',
    dueDate: '2023-11-28'
  },
  { 
    id: 'INV-007', 
    customer: 'Beta Co', 
    email: 'accounts@betaco.com',
    customerAddress: '321 Second St, Betatown',
    gstin: '33BCDAF2345E1Z0',
    description: 'Support and Maintenance',
    lineItems: [{ name: 'Annual Support', quantity: 1, price: 750.0 }],
    amount: 750.0, 
    status: 'Pending', 
    date: '2023-11-01',
    dueDate: '2023-12-01'
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', vendor: 'Office Supplies Ltd.', amount: 120.5, status: 'Approved', date: '2023-10-20' },
  { id: 'PO-002', vendor: 'Hardware Solutions', amount: 899.99, status: 'Pending', date: '2023-10-22' },
  { id: 'PO-003', vendor: 'Cloud Services Inc.', amount: 300.0, status: 'Approved', date: '2023-10-05' },
  { id: 'PO-004', vendor: 'Office Supplies Ltd.', amount: 80.0, status: 'Rejected', date: '2023-10-25' },
];

export const quotations: Quotation[] = [
  { id: 'QUO-001', customer: 'Future Systems', amount: 1200.0, status: 'Sent', expiryDate: '2023-11-15' },
  { id: 'QUO-002', customer: 'Next Gen Web', amount: 5400.0, status: 'Accepted', expiryDate: '2023-11-01' },
  { id: 'QUO-003', customer: 'Dynamic Digital', amount: 3250.0, status: 'Expired', expiryDate: '2023-10-20' },
  { id: 'QUO-004', customer: 'Future Systems', amount: 800.0, status: 'Sent', expiryDate: '2023-11-30' },
];
