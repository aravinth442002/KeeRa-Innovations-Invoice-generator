'use client';

import { useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from '@/components/dashboard-header';
import { clients as initialClients, type Client, masterDescriptions as initialMasterDescriptions, type MasterDescription } from '@/lib/data';
import { CreateClientDialog } from '@/components/create-client-dialog';
import { CreateDescriptionDialog } from '@/components/create-description-dialog';

function ClientsTab() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState<{ [key: string]: number }>({
    'Tech Solutions Inc.': 5,
    'Global Connect': 2,
    'Innovate LLC': 8,
  });

  const handleClientCreate = (newClient: Client) => {
    setClients((prev) => [{ ...newClient, id: `client-${Date.now()}` }, ...prev]);
    setInvoices(prev => ({...prev, [newClient.name]: 0}))
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    setClientToEdit(null);
  }

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      setClients((prev) =>
        prev.filter((c) => c.id !== clientToDelete)
      );
      setClientToDelete(null);
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
              <TableHead>Buyer GSTIN</TableHead>
              <TableHead>Buyer Email</TableHead>
              <TableHead>Total Invoices</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.gstin}</TableCell>
                <TableCell>{client.email}</TableCell>
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
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(client)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setClientToDelete(client.id)}
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
