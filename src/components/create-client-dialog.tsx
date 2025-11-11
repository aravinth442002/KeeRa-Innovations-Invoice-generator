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
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '@/lib/data';

type CreateClientDialogProps = {
  onClientCreate: (client: Omit<Client, 'id'>) => void;
  onClientUpdate: (client: Client) => void;
  clientToEdit?: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateClientDialog({ 
  onClientCreate, 
  onClientUpdate, 
  clientToEdit,
  open,
  onOpenChange
}: CreateClientDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');

  const isEditing = !!clientToEdit;

  useEffect(() => {
    if (isEditing && clientToEdit) {
      setName(clientToEdit.name);
      setEmail(clientToEdit.email);
      setPhone(clientToEdit.phone);
      setAddress(clientToEdit.address);
      setGstin(clientToEdit.gstin);
    } else {
      resetForm();
    }
  }, [clientToEdit, isEditing, open]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGstin('');
  };
  
  const handleSave = () => {
    if (name && email && address && gstin && phone) {
      const clientData = { name, email, phone, address, gstin };

      if (isEditing && clientToEdit) {
        onClientUpdate({ ...clientToEdit, ...clientData });
      } else {
        onClientCreate(clientData);
      }

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen)
    }}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Client
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Create New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this client.' : 'Fill out the form below to create a new client.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Client/Buyer Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Tech Solutions Inc." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Client/Buyer Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., accounts@techsolutions.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Client/Buyer Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +1 234 567 890" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gstin">Client/Buyer GSTIN</Label>
            <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="e.g., 27AABCT1234F1Z9" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="address">Client/Buyer Address</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Main St, Anytown" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>{isEditing ? 'Save Changes' : 'Create Client'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
