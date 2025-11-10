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
import type { Quotation } from '@/lib/data';

type CreateQuotationDialogProps = {
  onQuotationCreate: (quotation: Quotation) => void;
}

export function CreateQuotationDialog({ onQuotationCreate }: CreateQuotationDialogProps) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [quotationId, setQuotationId] = useState('');
  const [amount, setAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<'Sent' | 'Accepted' | 'Expired'>('Sent');

  const handleSave = () => {
    if (customer && quotationId && amount && expiryDate) {
      onQuotationCreate({
        id: quotationId,
        customer,
        amount: parseFloat(amount),
        status,
        expiryDate,
      });
      setOpen(false);
      // Reset form
      setCustomer('');
      setQuotationId('');
      setAmount('');
      setExpiryDate('');
      setStatus('Sent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Quotation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Quotation</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new quotation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="customer">Customer</Label>
            <Input id="customer" type="text" placeholder="Future Systems" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="quotation-id">Quotation ID</Label>
              <Input id="quotation-id" type="text" placeholder="QUO-005" value={quotationId} onChange={(e) => setQuotationId(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="2500.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'Sent' | 'Accepted' | 'Expired') => setStatus(value)}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save Quotation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
