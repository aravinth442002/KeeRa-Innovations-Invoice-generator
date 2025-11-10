'use client';

import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

type LineItem = {
  name: string;
  quantity: number;
  price: number;
};

const demoDescriptions = [
  'Web Development Services',
  'Graphic Design Services',
  'Consulting Services',
  'Software License',
  'Monthly Retainer',
  'Project Milestone 1',
  'Hardware purchase',
  'SEO and Marketing',
  'Content Creation',
  'Support and Maintenance',
];

export function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newItem, setNewItem] = useState<{ name: string; quantity: string; price: string }>({
    name: '',
    quantity: '',
    price: '',
  });
  const [description, setDescription] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity && newItem.price) {
      setLineItems([
        ...lineItems,
        {
          name: newItem.name,
          quantity: parseInt(newItem.quantity),
          price: parseFloat(newItem.price),
        },
      ]);
      setNewItem({ name: '', quantity: '', price: '' });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
  };
  
  const isAddItemDisabled = !newItem.name || !newItem.quantity || !newItem.price;

  const totalAmount = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new invoice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[80vh] gap-6 overflow-y-auto py-4 pr-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="customer">Customer Name</Label>
              <Input id="customer" type="text" placeholder="Acme Inc." />
            </div>
             <div className="grid gap-3">
              <Label htmlFor="email">Email ID</Label>
              <Input id="email" type="email" placeholder="contact@acme.com" />
            </div>
          </div>
           <div className="grid gap-3">
            <Label htmlFor="customer-address">Customer Address</Label>
            <Textarea id="customer-address" placeholder="123 Main St, Anytown, USA" />
          </div>
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <div className="grid gap-3">
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input id="invoice-number" type="text" placeholder="INV-008" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" type="text" placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input id="issue-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" />
            </div>
          </div>

           <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Select onValueChange={setDescription} value={description}>
              <SelectTrigger id="description">
                <SelectValue placeholder="Select a description" />
              </SelectTrigger>
              <SelectContent>
                {demoDescriptions.map((desc) => (
                  <SelectItem key={desc} value={desc}>
                    {desc}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Description</SelectItem>
              </SelectContent>
            </Select>
            {description === 'custom' && (
              <Textarea
                placeholder="Enter your custom description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium">Invoice Items</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto_auto]">
              <div className="grid gap-1.5">
                  <Label htmlFor="item-name" className="sr-only">Item Name</Label>
                  <Input id="item-name" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                  <Label htmlFor="quantity" className="sr-only">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}/>
              </div>
              <div className="grid gap-1.5">
                  <Label htmlFor="price" className="sr-only">Price</Label>
                  <Input id="price" type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}/>
              </div>
              <Button onClick={handleAddItem} disabled={isAddItemDisabled} className="w-full sm:w-auto">
                Add Item
              </Button>
            </div>
          </div>
            
          {lineItems.length > 0 && (
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
