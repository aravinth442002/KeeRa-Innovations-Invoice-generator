'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { DashboardHeader } from '@/components/dashboard-header';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { InvoicePreview } from '@/components/invoice-preview';
import {
  invoices as initialInvoices,
  type Invoice,
  type LineItem,
} from '@/lib/data';
import { demoDescriptions } from '@/lib/data';

function NewInvoiceForm() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');

  // Seller details (pulled from "settings", mocked for now)
  const sellerDetails = {
    name: 'KeeRa Innovations',
    address: '112-A, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600042',
    gstin: '12-3456789',
  };

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { name: '', quantity: 1, price: 0, hsn: '' },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<
    'Draft' | 'Given' | 'Processing' | 'Received'
  >('Draft');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [description, setDescription] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const isEditing = !!invoiceId;

  useEffect(() => {
    if (isEditing) {
      const invoiceToEdit = initialInvoices.find((inv) => inv.id === invoiceId);
      if (invoiceToEdit) {
        setInvoiceNumber(invoiceToEdit.id);
        setIssueDate(invoiceToEdit.date);
        // @ts-ignore
        setStatus(invoiceToEdit.status); // Note: Statuses might not match new structure
        setCustomerName(invoiceToEdit.customer);
        setCustomerAddress(invoiceToEdit.customerAddress);
        setCustomerEmail(invoiceToEdit.email);
        setCustomerPhone(invoiceToEdit.phone || '');
        setCustomerGstin(invoiceToEdit.gstin);
        setLineItems(invoiceToEdit.lineItems);

        const isDemoDesc = demoDescriptions.includes(invoiceToEdit.description);
        if (isDemoDesc) {
          setDescription(invoiceToEdit.description);
          setCustomDescription('');
        } else {
          setDescription('custom');
          setCustomDescription(invoiceToEdit.description);
        }
      }
    } else {
        // Generate a new invoice number for creation
        setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000)}`);
    }
  }, [isEditing, invoiceId]);

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updatedLineItems = [...lineItems];
    // @ts-ignore
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { name: '', quantity: 1, price: 0, hsn: '' }]);
  };

  const handleRemoveLineItem = (index: number) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
  };

  const subtotal = lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
    0
  );
  // Assuming a flat 18% GST for calculation preview
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;

  const finalDescription = description === 'custom' ? customDescription : description;

  const currentInvoiceData: Omit<Invoice, 'amount' | 'status' | 'date'> & {
    amount: number;
    status: 'Draft' | 'Given' | 'Processing' | 'Received';
    date: string;
  } = {
    id: invoiceNumber,
    issueDate,
    status,
    customer: customerName,
    customerAddress,
    email: customerEmail,
    phone: customerPhone,
    gstin: customerGstin,
    seller: sellerDetails,
    description: finalDescription,
    lineItems,
    amount: grandTotal,
    dueDate: '', // This needs an input field if required.
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title={isEditing ? 'Edit Invoice' : 'Create Invoice'}
        description="Enter invoice details on the left and see a live preview on the right."
      >
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/invoices">Cancel</Link>
            </Button>
            <Button>Save Draft</Button>
            <Button>Finalize & Send</Button>
        </div>
      </DashboardHeader>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pt-0 sm:p-6 sm:pt-0">
        {/* Left Container: Data Entry */}
        <div className="flex flex-col gap-6">
           {/* Header & Status */}
           <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input value={invoiceNumber} readOnly disabled className="font-mono"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input id="issue-date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value: 'Draft' | 'Given' | 'Processing' | 'Received') => setStatus(value)}>
                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Given">Given</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Received">Received</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
           </Card>
            
            {/* Seller & Buyer Details */}
            <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">FROM</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">{sellerDetails.name}</p>
                            <p className="text-muted-foreground">{sellerDetails.address.split(',').join(', ')}</p>
                            <p className="text-muted-foreground">GSTIN: {sellerDetails.gstin}</p>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">TO</h3>
                        <div className="space-y-2">
                            <Input placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                            <Textarea placeholder="Customer Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
                            <Input placeholder="Customer Email ID" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                            <Input placeholder="Customer Phone" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                            <Input placeholder="Customer GSTIN" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items List */}
             <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Items</h3>
               {lineItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 grid grid-cols-[1fr_auto_auto_auto_auto] items-end gap-2">
                     <div className="space-y-1">
                        {index === 0 && <Label>Item Name</Label>}
                        <Input placeholder="E.g., Web Design" value={item.name} onChange={e => handleLineItemChange(index, 'name', e.target.value)} />
                    </div>
                     <div className="space-y-1 w-24">
                        {index === 0 && <Label>Price</Label>}
                        <Input type="number" placeholder="0.00" value={item.price} onChange={e => handleLineItemChange(index, 'price', parseFloat(e.target.value) || 0)} />
                    </div>
                     <div className="space-y-1 w-20">
                        {index === 0 && <Label>Quantity</Label>}
                        <Input type="number" placeholder="1" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)} />
                    </div>
                     <div className="space-y-1 w-24">
                        {index === 0 && <Label>HSN/SAC</Label>}
                        <Input placeholder="998314" value={item.hsn} onChange={e => handleLineItemChange(index, 'hsn', e.target.value)} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveLineItem(index)} disabled={lineItems.length === 1}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </CardContent>
                </Card>
               ))}
               <Button variant="outline" onClick={handleAddLineItem} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4"/> Add Item
               </Button>
            </div>

            {/* Description */}
            <Card>
                <CardContent className="pt-6 space-y-2">
                    <Label htmlFor="description">Description / Notes</Label>
                    <Select onValueChange={setDescription} value={description}>
                      <SelectTrigger id="description">
                        <SelectValue placeholder="Select a pre-defined description" />
                      </SelectTrigger>
                      <SelectContent>
                        {demoDescriptions.map((desc) => (
                          <SelectItem key={desc} value={desc}>
                            {desc}
                          </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem value="custom">Custom Description</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Textarea 
                      placeholder="Add any additional terms or notes..."
                      value={description === 'custom' ? customDescription : description}
                      onChange={e => {
                        if (description === 'custom') {
                          setCustomDescription(e.target.value);
                        } else {
                          setDescription('custom');
                          setCustomDescription(e.target.value);
                        }
                      }}
                    />
                </CardContent>
            </Card>

        </div>

        {/* Right Container: Live Preview */}
        <div className="sticky top-0 h-full">
            <Card className="overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                    <Label>Template Selector</Label>
                     <Select defaultValue="default">
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default Template</SelectItem>
                            <SelectItem value="modern">Modern Template</SelectItem>
                            <SelectItem value="classic">Classic Template</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="p-6 h-[calc(100vh-200px)] overflow-y-auto">
                    <InvoicePreview invoice={currentInvoiceData} />
                </div>
                <div className="p-6 border-t bg-muted/50 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Tax/GST (18%)</span>
                        <span>{formatCurrency(gstAmount)}</span>
                    </div>
                     <div className="flex justify-between font-semibold text-base">
                        <span>Grand Total</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                </div>
            </Card>
        </div>
      </main>
    </div>
  );
}

export default function NewInvoicePage() {
    return (
        <Suspense fallback={<div>Loading invoice...</div>}>
            <NewInvoiceForm />
        </Suspense>
    )
}

    