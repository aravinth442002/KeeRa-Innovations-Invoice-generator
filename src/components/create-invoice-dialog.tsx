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
import { useRouter } from 'next/navigation';
import type { Invoice } from '@/lib/data';

type CreateInvoiceDialogProps = {
  onInvoiceCreate: (invoice: Invoice) => void;
  onInvoiceUpdate: (invoice: Invoice) => void;
  invoiceToEdit?: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateInvoiceDialog({ onOpenChange, open, invoiceToEdit }: CreateInvoiceDialogProps) {
  const router = useRouter();
  const isEditing = !!invoiceToEdit;

  const handleOpen = () => {
    const path = isEditing ? `/dashboard/invoices/new?id=${invoiceToEdit?.id}` : '/dashboard/invoices/new';
    router.push(path);
    onOpenChange(false); // Close the dialog as we are navigating away
  }

  // Effect to handle external state changes for editing
  useEffect(() => {
    if (isEditing && open) {
        handleOpen();
    }
  }, [isEditing, open]);

  return (
    <Dialog open={open && !isEditing} onOpenChange={onOpenChange}>
      {!isEditing && (
        <DialogTrigger asChild>
            <Button onClick={() => router.push('/dashboard/invoices/new')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invoice
            </Button>
        </DialogTrigger>
      )}
      {/* The content is now primarily handled by the new page, but we can keep a basic dialog for other purposes if needed */}
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
                You will be redirected to the invoice creation page.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleOpen}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
