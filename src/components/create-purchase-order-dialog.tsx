'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PurchaseOrder } from '@/lib/data';

type CreatePurchaseOrderDialogProps = {
  onPurchaseOrderCreate: (po: PurchaseOrder) => void;
};

export function CreatePurchaseOrderDialog({ onPurchaseOrderCreate }: CreatePurchaseOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Pending');
  
  const handleSave = () => {
    if (vendor && poNumber && amount) {
      onPurchaseOrderCreate({
        id: poNumber,
        vendor,
        amount: parseFloat(amount),
        status,
        date: orderDate,
      });
      setOpen(false);
      // Reset form
      setVendor('');
      setPoNumber('');
      setAmount('');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setStatus('Pending');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create PO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new purchase order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" type="text" placeholder="Office Supplies Ltd." value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="po-number">PO Number</Label>
              <Input id="po-number" type="text" placeholder="PO-005" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="199.99" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <div className="grid gap-3">
              <Label htmlFor="order-date">Order Date</Label>
              <Input id="order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'Approved' | 'Pending' | 'Rejected') => setStatus(value)}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save Purchase Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
