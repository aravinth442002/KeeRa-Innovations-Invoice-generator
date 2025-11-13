'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from '@/components/dashboard-header';
import { type Client, type MasterDescription } from '@/lib/data';
import { CreateClientDialog } from '@/components/create-client-dialog';
import { CreateDescriptionDialog } from '@/components/create-description-dialog';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function ClientsTab() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [invoices] = useState<{ [key: string]: number }>({
    'Tech Solutions Inc.': 5,
    'Global Connect': 2,
    'Innovate LLC': 8,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast({ title: 'Error', description: 'Could not fetch clients.', variant: 'destructive' });
    }
  };

  const handleClientCreate = async (newClient: Omit<Client, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, newClient);
      if (response.data.success) {
        fetchClients();
        toast({ title: 'Client created', description: `${newClient.name} has been added.` });
      }
    } catch (error) {
      console.error('Failed to create client:', error);
      toast({ title: 'Error', description: 'Could not create client.', variant: 'destructive' });
    }
  };

  const handleClientUpdate = async (updatedClient: Client) => {
    try {
      const response = await axios.put(`${API_URL}/clients/${updatedClient.id}`, updatedClient);
      if (response.data.success) {
        fetchClients();
        toast({ title: 'Client updated', description: `${updatedClient.name} has been updated.` });
      }
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
                <CardTitle>Clients</CardTitle>
                <CardDescription>
                    A list of all clients (buyers) in your account.
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
              <TableHead>Buyer Name</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Invoices</TableHead>
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
                  <TableCell>{client.gstin}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{invoices[client.name] || 0}</TableCell>
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No clients found.
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

function DescriptionsTab() {
    const { toast } = useToast();
    const [descriptions, setDescriptions] = useState<MasterDescription[]>([]);
    const [descriptionToDelete, setDescriptionToDelete] = useState<string | null>(null);
    const [descriptionToEdit, setDescriptionToEdit] = useState<MasterDescription | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        fetchDescriptions();
    }, []);

    const fetchDescriptions = async () => {
        try {
            const response = await axios.get(`${API_URL}/descriptions`);
            if (response.data.success) {
                setDescriptions(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch descriptions:', error);
            toast({ title: 'Error', description: 'Could not fetch descriptions.', variant: 'destructive' });
        }
    };

    const handleDescriptionCreate = async (newDesc: Omit<MasterDescription, 'id'>) => {
        try {
            const response = await axios.post(`${API_URL}/descriptions`, newDesc);
            if(response.data.success) {
                fetchDescriptions();
                toast({ title: 'Description created' });
            }
        } catch (error) {
             console.error('Failed to create description:', error);
             toast({ title: 'Error', description: 'Could not create description.', variant: 'destructive' });
        }
    };

    const handleDescriptionUpdate = async (updatedDesc: MasterDescription) => {
        try {
            const response = await axios.put(`${API_URL}/descriptions/${updatedDesc.id}`, updatedDesc);
             if(response.data.success) {
                fetchDescriptions();
                toast({ title: 'Description updated' });
            }
        } catch (error) {
            console.error('Failed to update description:', error);
            toast({ title: 'Error', description: 'Could not update description.', variant: 'destructive' });
        }
        setDescriptionToEdit(null);
    }

    const handleDeleteConfirm = async () => {
        if (descriptionToDelete) {
            try {
                await axios.delete(`${API_URL}/descriptions/${descriptionToDelete}`);
                fetchDescriptions();
                toast({ title: 'Description deleted' });
            } catch (error) {
                console.error('Failed to delete description:', error);
                toast({ title: 'Error', description: 'Could not delete description.', variant: 'destructive' });
            }
            setDescriptionToDelete(null);
        }
    };
    
    const openEditDialog = (desc: MasterDescription) => {
        setDescriptionToEdit(desc);
        setIsCreateDialogOpen(true);
    };

    const handleDialogStateChange = (open: boolean) => {
        setIsCreateDialogOpen(open);
        if (!open) {
            setDescriptionToEdit(null);
        }
    }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Descriptions</CardTitle>
                <CardDescription>
                    Manage reusable descriptions for your documents.
                </CardDescription>
            </div>
             <CreateDescriptionDialog
                onDescriptionCreate={handleDescriptionCreate}
                onDescriptionUpdate={handleDescriptionUpdate}
                descriptionToEdit={descriptionToEdit}
                open={isCreateDialogOpen}
                onOpenChange={handleDialogStateChange}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {descriptions.map((desc) => (
              <TableRow key={desc.id}>
                <TableCell className="font-medium">{desc.title}</TableCell>
                <TableCell className="max-w-md truncate">{desc.content}</TableCell>
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
                      <DropdownMenuItem onClick={() => openEditDialog(desc)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDescriptionToDelete(desc.id)}
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
         <AlertDialog open={!!descriptionToDelete} onOpenChange={() => setDescriptionToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                description template.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDescriptionToDelete(null)}>Cancel</AlertDialogCancel>
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
        title="Master"
        description="Manage core data for clients and descriptions."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <Tabs defaultValue="clients">
            <TabsList>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="clients">
               <ClientsTab />
            </TabsContent>
            <TabsContent value="descriptions">
                <DescriptionsTab />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
