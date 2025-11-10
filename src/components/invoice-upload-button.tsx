'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileUp, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { extractInvoiceDetailsFromImage } from '@/ai/flows/extract-invoice-details-from-image';

export function InvoiceUploadButton() {
  const [open, setOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleExtract = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an invoice image to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const result = await extractInvoiceDetailsFromImage({
          invoiceImageDataUri: base64Data,
        });

        toast({
          title: 'Extraction Successful',
          description: 'Invoice details have been extracted.',
        });
        
        const queryParams = new URLSearchParams({
          totalAmount: result.totalAmount,
          invoiceNumber: result.invoiceNumber,
          dueDate: result.dueDate,
          status: result.status,
        });
        
        router.push(`/dashboard/invoices/new?${queryParams.toString()}`);
        setOpen(false);
      };
      reader.onerror = (error) => {
        throw error;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Extraction Failed',
        description: 'Could not extract details from the invoice. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Import from Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Import Invoice from Image</DialogTitle>
          <DialogDescription>
            Let AI extract the details from your scanned invoice. Upload an image
            to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="invoice-image">Invoice Image</Label>
            <Input id="invoice-image" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {previewUrl && (
            <div className="relative mt-2 h-48 w-full">
              <Image
                src={previewUrl}
                alt="Invoice preview"
                fill
                className="rounded-md object-contain"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleExtract} disabled={isExtracting || !file}>
            {isExtracting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Extract Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
