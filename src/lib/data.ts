
export type LineItem = {
  name: string;
  quantity: number;
  price: number;
  hsn: string;
};

export type Seller = {
  _id?: string;
  name: string;
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
export const invoices: Invoice[] = [
    {
      "id": "INV-2024-001",
      "customer": "Tech Solutions Inc.",
      "email": "contact@techsolutions.com",
      "phone": "+1-202-555-0176",
      "customerAddress": "123 Tech Park, Silicon Valley, CA 94000",
      "gstin": "29AABCU9567M1Z5",
      "seller": {
          "name": "KeeRa Innovations",
          "address": "112-A, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600042",
          "gstin": "12-3456789"
      },
      "description": "Annual software license renewal.",
      "lineItems": [{ "name": "Software License", "quantity": 1, "price": 45000, "hsn": "997331" }],
      "amount": 45000.00,
      "status": "Paid",
      "date": "2024-05-15",
      "dueDate": "2024-06-14"
    },
    {
      "id": "INV-2024-002",
      "customer": "Global Connect",
      "email": "support@globalconnect.net",
       "phone": "+44 20 7946 0958",
      "customerAddress": "456 Business Hub, London, EC1Y 8SY, UK",
      "gstin": "27AAGCB2489F1Z5",
      "seller": {
          "name": "KeeRa Innovations",
          "address": "112-A, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600042",
          "gstin": "12-3456789"
      },
      "description": "Consulting services rendered for Q4.",
      "lineItems": [{ "name": "Consulting", "quantity": 50, "price": 250.01, "hsn": "998314" }],
      "amount": 12500.50,
      "status": "Pending",
      "date": "2024-05-20",
      "dueDate": "2024-06-19"
    },
    {
      "id": "INV-2024-003",
      "customer": "Innovate LLC",
      "email": "hello@innovatellc.dev",
      "phone": "+1-310-555-0182",
      "customerAddress": "789 Innovation Drive, Los Angeles, CA 90210",
      "gstin": "33AACCT4865L1Z8",
       "seller": {
          "name": "KeeRa Innovations",
          "address": "112-A, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600042",
          "gstin": "12-3456789"
      },
      "description": "Hardware warranty included.",
      "lineItems": [{ "name": "Server Rack", "quantity": 2, "price": 3900, "hsn": "847150" }],
      "amount": 7800.00,
      "status": "Overdue",
      "date": "2024-04-10",
      "dueDate": "2024-05-10"
    }
];

export const purchaseOrders: PurchaseOrder[] = [];

export const quotations: Quotation[] = [
    {
      "id": "QUO-2024-001",
      "customer": "Innovate LLC",
      "amount": 15000.00,
      "status": "Sent",
      "expiryDate": "2024-06-30"
    },
    {
      "id": "QUO-2024-002",
      "customer": "Tech Solutions Inc.",
      "amount": 88000.00,
      "status": "Accepted",
      "expiryDate": "2024-07-15"
    },
    {
      "id": "QUO-2024-003",
      "customer": "Global Connect",
      "amount": 25000.00,
      "status": "Expired",
      "expiryDate": "2024-05-31"
    }
];

export const clients: Client[] = [];

export const masterDescriptions: MasterDescription[] = [
    { id: 'desc-001', title: 'Standard Refund Policy', content: 'All sales are final. Refunds are only provided for defective products reported within 7 days of receipt.' },
    { id: 'desc-002', title: 'Service Terms (30 Days)', content: 'Payment is due within 30 days of the invoice date. A late fee of 2% per month will be applied to overdue balances.' },
    { id: 'desc-003', title: 'Hardware Warranty', content: 'This product includes a 1-year limited hardware warranty covering manufacturing defects. It does not cover accidental damage.' },
];

    