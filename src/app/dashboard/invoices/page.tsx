
'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DashboardHeader } from '@/components/dashboard-header';
import { type Invoice } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import { InvoiceUploadButton } from '@/components/invoice-upload-button';
import { CreateInvoiceDialog } from '@/components/create-invoice-dialog';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const statusVariant: { [key: string]: string } = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800',
  Draft: 'bg-red-100 text-red-800',
  Processing: 'bg-yellow-100 text-yellow-800',
  Received: 'bg-green-100 text-green-800',
};

export default function InvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_URL}/invoices`);
      if (Array.isArray(response.data)) {
        setInvoices(response.data);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast({ title: 'Error', description: 'Could not fetch invoices.', variant: 'destructive' });
      setInvoices([]); // Set to empty array on error
    }
  };


  const handleInvoiceCreate = (newInvoice: Invoice) => {
    setInvoices((prevInvoices) => [newInvoice, ...prevInvoices]);
  };

  const handleInvoiceUpdate = (updatedInvoice: Invoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

  const handleDeleteConfirm = async () => {
    if (invoiceToDelete) {
      try {
        await axios.delete(`${API_URL}/invoices/${invoiceToDelete}`);
        toast({ title: 'Success', description: 'Invoice deleted successfully.' });
        fetchInvoices();
      } catch (error) {
        console.error('Failed to delete invoice:', error);
        toast({ title: 'Error', description: 'Could not delete invoice.', variant: 'destructive' });
      } finally {
        setInvoiceToDelete(null);
      }
    }
  };
  
  const openEditPage = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/new?id=${invoice.id}`);
  };

  const handleDialogStateChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
  }

  const viewPdf = (invoiceId: string) => {
    window.open(`${API_URL}/invoices/${invoiceId}/pdf`, '_blank');
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardHeader
          title="Invoices"
          description="Manage your customer invoices."
        >
          <div className="flex items-center gap-2">
            <InvoiceUploadButton />
            <CreateInvoiceDialog
              onInvoiceCreate={handleInvoiceCreate}
              onInvoiceUpdate={handleInvoiceUpdate}
              open={isCreateDialogOpen}
              onOpenChange={handleDialogStateChange}
            />
          </div>
        </DashboardHeader>
        <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>
                A list of all invoices in your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>
                          <Badge className={cn('border-transparent', statusVariant[invoice.status] || 'bg-gray-100 text-gray-800')}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => viewPdf(invoice.id)}>View</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditPage(invoice)}>Edit</DropdownMenuItem>
                               {invoice.status === 'Received' && (
                                <DropdownMenuItem>Download</DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setInvoiceToDelete(invoice.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={!!invoiceToDelete} onOpenChange={() => setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              invoice from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvoiceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
