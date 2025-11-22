
'use client';

import { useState, useEffect } from 'react';
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
  onQuotationCreate: (quotation: Omit<Quotation, '_id'>) => void;
  onQuotationUpdate: (quotation: Quotation) => void;
  quotationToEdit?: Quotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQuotationDialog({ 
  onQuotationCreate,
  onQuotationUpdate,
  quotationToEdit,
  open,
  onOpenChange,
}: CreateQuotationDialogProps) {
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<'Sent' | 'Accepted' | 'Expired'>('Sent');

  const isEditing = !!quotationToEdit;

  useEffect(() => {
    if (isEditing && quotationToEdit) {
      setCustomer(quotationToEdit.customer);
      setAmount(String(quotationToEdit.amount));
      setExpiryDate(new Date(quotationToEdit.expiryDate).toISOString().split('T')[0]);
      setStatus(quotationToEdit.status);
    } else {
      resetForm();
    }
  }, [quotationToEdit, isEditing, open]);

  const resetForm = () => {
    setCustomer('');
    setAmount('');
    setExpiryDate('');
    setStatus('Sent');
  };

  const handleSave = () => {
    if (customer && amount && expiryDate) {
      const quotationData = {
        customer,
        amount: parseFloat(amount),
        status,
        expiryDate,
      };

      if (isEditing && quotationToEdit) {
        onQuotationUpdate({ ...quotationToEdit, ...quotationData });
      } else {
        onQuotationCreate(quotationData);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    }}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quotation
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Quotation' : 'Create Quotation'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this quotation.' : 'Fill out the form below to create a new quotation.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="customer">Customer</Label>
            <Input id="customer" type="text" placeholder="Future Systems" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="2500.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
             <div className="grid gap-3">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save Quotation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
