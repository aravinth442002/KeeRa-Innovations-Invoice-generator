'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateClientDialog } from '@/components/create-client-dialog';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
};

type Seller = {
  _id?: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  bank: {
    name: string;
    branch: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  }
}

function SellerDetailsTab() {
  const { toast } = useToast();
  const [seller, setSeller] = useState<Partial<Seller>>({
    bank: { name: '', branch: '', accountNumber: '', ifsc: '', upiId: '' }
  });

  useEffect(() => {
    fetchSeller();
  }, []);

  const fetchSeller = async () => {
    try {
      const response = await axios.get(`${API_URL}/sellers`);
      if (response.data.success && response.data.count > 0) {
        setSeller(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch seller:', error);
    }
  };

  const handleSellerChange = (field: keyof Omit<Seller, 'bank'>, value: string) => {
    setSeller(prev => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field: keyof Seller['bank'], value: string) => {
    setSeller(prev => ({
      ...prev,
      bank: { ...prev.bank!, [field]: value },
    }));
  };

  const handleSaveSeller = async () => {
    try {
      if (seller._id) {
        await axios.put(`${API_URL}/sellers/${seller._id}`, seller);
      } else {
        await axios.post(`${API_URL}/sellers`, seller);
      }
      toast({ title: 'Success', description: 'Seller details saved successfully.' });
      fetchSeller();
    } catch (error) {
      console.error('Failed to save seller details:', error);
      toast({ title: 'Error', description: 'Could not save seller details.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
          <CardDescription>This information will appear as the "FROM" party on all invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seller-name">Seller Name</Label>
            <Input id="seller-name" value={seller.name || ''} onChange={e => handleSellerChange('name' as any, e.target.value)} placeholder="Your company's registered name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seller-address">Address</Label>
            <Input id="seller-address" value={seller.address || ''} onChange={e => handleSellerChange('address', e.target.value)} placeholder="Complete registered business address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seller-gstin">GSTIN</Label>
            <Input id="seller-gstin" value={seller.gstin || ''} onChange={e => handleSellerChange('gstin', e.target.value)} placeholder="Goods and Services Tax Identification Number" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller-email">Email</Label>
              <Input id="seller-email" type="email" value={seller.email || ''} onChange={e => handleSellerChange('email', e.target.value)} placeholder="Official billing or contact email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-phone">Phone</Label>
              <Input id="seller-phone" type="tel" value={seller.phone || ''} onChange={e => handleSellerChange('phone', e.target.value)} placeholder="Contact telephone number" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSeller}>Save Seller Information</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank and Payment Details</CardTitle>
          <CardDescription>This remittance information will be printed on the invoice for payment collection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input id="bank-name" value={seller.bank?.name || ''} onChange={e => handleBankChange('name', e.target.value)} placeholder="The name of your bank" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-branch">Branch</Label>
              <Input id="bank-branch" value={seller.bank?.branch || ''} onChange={e => handleBankChange('branch', e.target.value)} placeholder="The bank branch location" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" value={seller.bank?.accountNumber || ''} onChange={e => handleBankChange('accountNumber', e.target.value)} placeholder="Your bank account number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc-code">IFSC</Label>
              <Input id="ifsc-code" value={seller.bank?.ifsc || ''} onChange={e => handleBankChange('ifsc', e.target.value)} placeholder="Indian Financial System Code" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input id="upi-id" value={seller.bank?.upiId || ''} onChange={e => handleBankChange('upiId', e.target.value)} placeholder="Unified Payments Interface ID (optional)" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSeller}>Save Bank Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ClientsTab() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      if (response.data.success) {
        // The virtual 'id' should be coming from the backend
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast({ title: 'Error', description: 'Could not fetch clients.', variant: 'destructive' });
    }
  };

  const handleClientCreate = async (newClient: Omit<Client, 'id'>) => {
    try {
      await axios.post(`${API_URL}/clients`, newClient);
      fetchClients();
      toast({ title: 'Client created', description: `${newClient.name} has been added.` });
    } catch (error) {
      console.error('Failed to create client:', error);
      toast({ title: 'Error', description: 'Could not create client.', variant: 'destructive' });
    }
  };

  const handleClientUpdate = async (updatedClient: Client) => {
    try {
      await axios.put(`${API_URL}/clients/${updatedClient.id}`, updatedClient);
      fetchClients();
      toast({ title: 'Client updated', description: `${updatedClient.name} has been updated.` });
    } catch (error) {
      console.error('Failed to update client:', error);
      toast({ title: 'Error', description: 'Could not update client.', variant: 'destructive' });
    }
    setClientToEdit(null);
  }

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    try {
      await axios.delete(`${API_URL}/clients/${clientToDelete.id}`);
      fetchClients();
      toast({ title: 'Client deleted', description: `${clientToDelete.name} has been deleted.` });
    } catch (error) {
        console.error('Failed to delete client:', error);
        toast({ title: 'Error', description: 'Could not delete client.', variant: 'destructive' });
    }
    setClientToDelete(null);
  };

  const openEditDialog = (client: Client) => {
    setClientToEdit(client);
    setIsCreateDialogOpen(true);
  };
  
  const handleDialogStateChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setClientToEdit(null);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Client (Buyer) Management</CardTitle>
                <CardDescription>
                    Manage the master data for your customers.
                </CardDescription>
            </div>
            <CreateClientDialog
                onClientCreate={handleClientCreate}
                onClientUpdate={handleClientUpdate}
                clientToEdit={clientToEdit}
                open={isCreateDialogOpen}
                onOpenChange={handleDialogStateChange}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.gstin}</TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setClientToDelete(client)}
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
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No clients found. Add one to get started.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                client and all associated data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default function MasterPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title="Master Data"
        description="Manage core static details for your business."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <Tabs defaultValue="seller">
            <TabsList>
                <TabsTrigger value="seller">Seller Details</TabsTrigger>
                <TabsTrigger value="clients">Client (Buyer) Management</TabsTrigger>
            </TabsList>
            <TabsContent value="seller">
               <SellerDetailsTab />
            </TabsContent>
            <TabsContent value="clients">
                <ClientsTab />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
