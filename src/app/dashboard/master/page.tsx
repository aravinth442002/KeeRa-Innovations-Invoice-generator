'use client';

import { useState } from 'react';
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
import { type Client, masterDescriptions as initialMasterDescriptions, type MasterDescription } from '@/lib/data';
import { CreateClientDialog } from '@/components/create-client-dialog';
import { CreateDescriptionDialog } from '@/components/create-description-dialog';
import { useCollection } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


function ClientsTab() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const clientsQuery = firestore ? collection(firestore, 'clients') : null;
  const { data: clients, loading, error } = useCollection<Client>(clientsQuery);
  
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // This state is just for demonstration as we don't have invoice data in firestore yet
  const [invoices] = useState<{ [key: string]: number }>({
    'Tech Solutions Inc.': 5,
    'Global Connect': 2,
    'Innovate LLC': 8,
  });

  const handleClientCreate = async (newClient: Omit<Client, 'id'>) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'clients'), newClient);
      toast({ title: 'Client created', description: `${newClient.name} has been added.` });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Could not create client.', variant: 'destructive' });
    }
  };

  const handleClientUpdate = async (updatedClient: Client) => {
    if (!firestore || !updatedClient.id) return;
    try {
      const clientRef = doc(firestore, 'clients', updatedClient.id);
      await updateDoc(clientRef, updatedClient as DocumentData);
      toast({ title: 'Client updated', description: `${updatedClient.name} has been updated.` });
      setClientToEdit(null);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Could not update client.', variant: 'destructive' });
    }
  }

  const handleDeleteConfirm = async () => {
    if (!firestore || !clientToDelete || !clientToDelete.id) return;
    try {
      await deleteDoc(doc(firestore, 'clients', clientToDelete.id));
      toast({ title: 'Client deleted', description: `${clientToDelete.name} has been deleted.` });
      setClientToDelete(null);
    } catch(e) {
       console.error(e);
      toast({ title: 'Error', description: 'Could not delete client.', variant: 'destructive' });
    }
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
            {loading ? (
                Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                        <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                        <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                        <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                        <TableCell><Skeleton className="h-5 w-12"/></TableCell>
                        <TableCell><Skeleton className="h-8 w-8"/></TableCell>
                    </TableRow>
                ))
            ) : error ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-destructive">
                        Error loading clients: {error.message}
                    </TableCell>
                </TableRow>
            ) : clients && clients.length > 0 ? (
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
    const [descriptions, setDescriptions] = useState<MasterDescription[]>(initialMasterDescriptions);
    const [descriptionToDelete, setDescriptionToDelete] = useState<string | null>(null);
    const [descriptionToEdit, setDescriptionToEdit] = useState<MasterDescription | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleDescriptionCreate = (newDesc: Omit<MasterDescription, 'id'>) => {
        setDescriptions((prev) => [{ ...newDesc, id: `desc-${Date.now()}` }, ...prev]);
    };

    const handleDescriptionUpdate = (updatedDesc: MasterDescription) => {
        setDescriptions((prev) =>
        prev.map((d) => (d.id === updatedDesc.id ? updatedDesc : d))
        );
        setDescriptionToEdit(null);
    }

    const handleDeleteConfirm = () => {
        if (descriptionToDelete) {
            setDescriptions((prev) => prev.filter((d) => d.id !== descriptionToDelete));
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
