'use client';

import { useState } from 'react';
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
import { quotations as initialQuotations, type Quotation } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { CreateQuotationDialog } from '@/components/create-quotation-dialog';

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  Accepted: 'default',
  Sent: 'secondary',
  Expired: 'destructive',
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);
  const [quotationToEdit, setQuotationToEdit] = useState<Quotation | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleQuotationCreate = (newQuotation: Quotation) => {
    setQuotations((prev) => [newQuotation, ...prev]);
  };
  
  const handleQuotationUpdate = (updatedQuotation: Quotation) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === updatedQuotation.id ? updatedQuotation : q))
    );
    setQuotationToEdit(null);
  }

  const handleDeleteConfirm = () => {
    if (quotationToDelete) {
      setQuotations((prev) =>
        prev.filter((quote) => quote.id !== quotationToDelete)
      );
      setQuotationToDelete(null);
    }
  };

  const openEditDialog = (quotation: Quotation) => {
    setQuotationToEdit(quotation);
    setIsCreateDialogOpen(true);
  };

  const handleDialogStateChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setQuotationToEdit(null);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardHeader
          title="Quotations"
          description="Manage your customer quotations."
        >
          <CreateQuotationDialog
            onQuotationCreate={handleQuotationCreate}
            onQuotationUpdate={handleQuotationUpdate}
            quotationToEdit={quotationToEdit}
            open={isCreateDialogOpen}
            onOpenChange={handleDialogStateChange}
          />
        </DashboardHeader>
        <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Quotations</CardTitle>
              <CardDescription>
                A list of all quotations in your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>{quote.customer}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[quote.status]}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{quote.expiryDate}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(quote.amount)}
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
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(quote)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setQuotationToDelete(quote.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={!!quotationToDelete} onOpenChange={() => setQuotationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              quotation from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuotationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
