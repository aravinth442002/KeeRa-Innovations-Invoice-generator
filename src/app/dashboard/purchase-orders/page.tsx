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
import { purchaseOrders as initialPurchaseOrders, type PurchaseOrder } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { CreatePurchaseOrderDialog } from '@/components/create-purchase-order-dialog';

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [poToDelete, setPoToDelete] = useState<string | null>(null);
  const [poToEdit, setPoToEdit] = useState<PurchaseOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handlePurchaseOrderCreate = (newPurchaseOrder: PurchaseOrder) => {
    setPurchaseOrders((prev) => [newPurchaseOrder, ...prev]);
  };

  const handlePurchaseOrderUpdate = (updatedPo: PurchaseOrder) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === updatedPo.id ? updatedPo : po))
    );
    setPoToEdit(null);
  }

  const handleDeleteConfirm = () => {
    if (poToDelete) {
      setPurchaseOrders((prev) =>
        prev.filter((po) => po.id !== poToDelete)
      );
      setPoToDelete(null);
    }
  };

  const openEditDialog = (po: PurchaseOrder) => {
    setPoToEdit(po);
    setIsCreateDialogOpen(true);
  };
  
  const handleDialogStateChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setPoToEdit(null);
    }
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <DashboardHeader
          title="Purchase Orders"
          description="Manage your company's purchase orders."
        >
           <CreatePurchaseOrderDialog
            onPurchaseOrderCreate={handlePurchaseOrderCreate}
            onPurchaseOrderUpdate={handlePurchaseOrderUpdate}
            purchaseOrderToEdit={poToEdit}
            open={isCreateDialogOpen}
            onOpenChange={handleDialogStateChange}
          />
        </DashboardHeader>
        <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <Card>
            <CardHeader>
              <CardTitle>All Purchase Orders</CardTitle>
              <CardDescription>
                A list of all purchase orders in your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.vendor}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[po.status]}>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(po.amount)}
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
                            <DropdownMenuItem onClick={() => openEditDialog(po)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setPoToDelete(po.id)}
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

      <AlertDialog open={!!poToDelete} onOpenChange={() => setPoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              purchase order from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPoToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
