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
import type { MasterDescription } from '@/lib/data';

type CreateDescriptionDialogProps = {
  onDescriptionCreate: (desc: Omit<MasterDescription, 'id'>) => void;
  onDescriptionUpdate: (desc: MasterDescription) => void;
  descriptionToEdit?: MasterDescription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateDescriptionDialog({ 
  onDescriptionCreate, 
  onDescriptionUpdate, 
  descriptionToEdit,
  open,
  onOpenChange
}: CreateDescriptionDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isEditing = !!descriptionToEdit;

  useEffect(() => {
    if (isEditing && descriptionToEdit) {
      setTitle(descriptionToEdit.title);
      setContent(descriptionToEdit.content);
    } else {
      resetForm();
    }
  }, [descriptionToEdit, isEditing, open]);

  const resetForm = () => {
    setTitle('');
    setContent('');
  };
  
  const handleSave = () => {
    if (title && content) {
      const descriptionData = { title, content };

      if (isEditing && descriptionToEdit) {
        onDescriptionUpdate({ ...descriptionToEdit, ...descriptionData });
      } else {
        onDescriptionCreate(descriptionData);
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
            Create Description
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Description' : 'Create New Description'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update this description template.' : 'Create a new reusable description for your documents.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Standard Refund Policy" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter the full description text..." rows={5} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>{isEditing ? 'Save Changes' : 'Create Description'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
