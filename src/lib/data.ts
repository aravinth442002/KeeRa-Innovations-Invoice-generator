export type Invoice = {
  id: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
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
  { id: 'INV-001', customer: 'OfficeFlow', amount: 250.0, status: 'Paid', date: '2023-10-23' },
  { id: 'INV-002', customer: 'Solutions Inc.', amount: 150.0, status: 'Pending', date: '2023-10-24' },
  { id: 'INV-003', customer: 'Tech Corp', amount: 350.0, status: 'Paid', date: '2023-10-15' },
  { id: 'INV-004', customer: 'Global Services', amount: 450.0, status: 'Overdue', date: '2023-09-01' },
  { id: 'INV-005', customer: 'OfficeFlow', amount: 550.0, status: 'Pending', date: '2023-10-28' },
  { id: 'INV-006', customer: 'Alpha Co', amount: 50.0, status: 'Paid', date: '2023-10-29' },
  { id: 'INV-007', customer: 'Beta Co', amount: 750.0, status: 'Pending', date: '2023-11-01' },
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
