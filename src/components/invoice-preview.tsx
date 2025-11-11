'use client';

import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import AppLogo from './app-logo'; // Assuming you have a logo component

type InvoicePreviewProps = {
  invoice: Omit<Invoice, 'amount' | 'status' | 'date'> & {
    amount: number;
    status: 'Draft' | 'Given' | 'Processing' | 'Received';
    date: string;
  }
};

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
    0
  );
  // This is for display purposes, matching the calculation on the main page
  const gstAmount = subtotal * 0.18; 
  const grandTotal = subtotal + gstAmount;

  return (
    <div className="bg-card p-8 rounded-lg shadow-sm border text-sm max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-2">
          <AppLogo />
          <div className="text-muted-foreground">
            <p>{invoice.seller.name}</p>
            <p>{invoice.seller.address}</p>
            <p>GSTIN: {invoice.seller.gstin}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-muted-foreground"># {invoice.id}</p>
           <p className="mt-2">
            <span className="font-semibold">Status:</span> {invoice.status}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {new Date(invoice.issueDate || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">BILL TO</h2>
        <div className="text-gray-700">
          <p className="font-bold">{invoice.customer || 'Customer Name'}</p>
          <p>{invoice.customerAddress || 'Customer Address'}</p>
          <p>{invoice.email || 'customer@email.com'}</p>
          <p>GSTIN: {invoice.gstin || 'Customer GSTIN'}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted-foreground/10">
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 font-semibold text-center">HSN/SAC</th>
              <th className="p-3 font-semibold text-center">Qty</th>
              <th className="p-3 font-semibold text-right">Price</th>
              <th className="p-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.name || 'Item Name'}</td>
                <td className="p-3 text-center">{item.hsn || '-'}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                <td className="p-3 text-right">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
            {invoice.lineItems.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-3 text-center text-muted-foreground">No items added yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (18%)</span>
            <span>{formatCurrency(gstAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer/Notes */}
      <div className="text-muted-foreground text-xs">
        <h3 className="font-semibold text-sm mb-2">Notes</h3>
        <p>{invoice.description || 'Thank you for your business.'}</p>
      </div>
    </div>
  );
}
