'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardHeader } from '@/components/dashboard-header';

function NewInvoiceForm() {
  const searchParams = useSearchParams();

  const defaultValues = {
    invoiceNumber: searchParams.get('invoiceNumber') || '',
    customer: searchParams.get('customer') || '',
    amount: searchParams.get('totalAmount')?.replace('$', '') || '',
    status: searchParams.get('status') || 'Pending',
    dueDate: searchParams.get('dueDate') || '',
    issueDate: new Date().toISOString().split('T')[0],
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title="Create Invoice"
        description="Fill out the form below to create a new invoice."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              All fields are required unless otherwise noted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  type="text"
                  placeholder="Acme Inc."
                  defaultValue={defaultValues.customer}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input
                    id="invoice-number"
                    type="text"
                    placeholder="INV-008"
                    defaultValue={defaultValues.invoiceNumber}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="99.99"
                    defaultValue={defaultValues.amount}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="grid gap-3">
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    defaultValue={defaultValues.issueDate}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    defaultValue={defaultValues.dueDate}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={defaultValues.status}>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/invoices">Cancel</Link>
                </Button>
                <Button type="submit">Save Invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function NewInvoicePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewInvoiceForm />
        </Suspense>
    )
}
