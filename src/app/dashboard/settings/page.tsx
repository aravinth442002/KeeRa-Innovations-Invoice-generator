
'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const BASE_URL = API_URL.replace('/api', '');


type Company = {
  _id: string;
  companyName: string;
  address: string;
  email: string;
  phoneNumber: string;
  companyLogo: string;
  companySignatureUrl: string;
  companySealUrl: string;
  taxId: string;
  accHolderName: string;
  branch: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Partial<Company>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [sealPreview, setSealPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);

  const [imageToDelete, setImageToDelete] = useState<{ type: 'logo' | 'signature' | 'seal', url: string | null } | null>(null);


  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      if (response.data && response.data.length > 0) {
        setCompany(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    }
  };

  const handleInputChange = (field: keyof Company, value: string) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'logo' | 'signature' | 'seal') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (fileType === 'logo') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
        setCompany(prev => ({ ...prev, companyLogo: file.name }));
      } else if (fileType === 'signature') {
        setSignatureFile(file);
        setSignaturePreview(previewUrl);
        setCompany(prev => ({ ...prev, companySignatureUrl: file.name }));
      } else {
        setSealFile(file);
        setSealPreview(previewUrl);
        setCompany(prev => ({ ...prev, companySealUrl: file.name }));
      }
    }
  };
  
 const handleSaveChanges = async (section: string) => {
    const formData = new FormData();

    // Ensure all company fields are appended, even if null/undefined
    const companyDataToSend = { ...company };
    if (!logoFile && !company.companyLogo) companyDataToSend.companyLogo = '';
    if (!signatureFile && !company.companySignatureUrl) companyDataToSend.companySignatureUrl = '';
    if (!sealFile && !company.companySealUrl) companyDataToSend.companySealUrl = '';


    Object.entries(companyDataToSend).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (logoFile) {
        formData.append('companyLogo', logoFile);
    }
    if (signatureFile) {
        formData.append('companySignatureUrl', signatureFile);
    }
    if (sealFile) {
        formData.append('companySealUrl', sealFile);
    }

    try {
      if (company._id) {
        await axios.put(`${API_URL}/companies/${company._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const response = await axios.post(`${API_URL}/companies`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCompany(response.data);
      }
      toast({
        title: 'Settings Saved',
        description: `Your ${section} details have been updated.`,
      });
      fetchCompanyData(); 
      // Reset previews and file objects
      setLogoFile(null);
      setSignatureFile(null);
      setSealFile(null);
      setLogoPreview(null);
      setSignaturePreview(null);
      setSealPreview(null);

    } catch (error) {
      console.error(`Failed to save ${section} details:`, error);
      toast({
        title: 'Error',
        description: `Could not save ${section} details.`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    const { type } = imageToDelete;

    const updatedCompanyData = { ...company };
    let fieldToClear: keyof Company;
    
    if (type === 'logo') fieldToClear = 'companyLogo';
    else if (type === 'signature') fieldToClear = 'companySignatureUrl';
    else fieldToClear = 'companySealUrl';

    // @ts-ignore
    updatedCompanyData[fieldToClear] = ''; // Set to empty string for backend

    try {
        if (company._id) {
            await axios.put(`${API_URL}/companies/${company._id}`, {
                ...updatedCompanyData,
                // Explicitly send empty strings for other image fields if they are also empty
                companyLogo: type === 'logo' ? '' : updatedCompanyData.companyLogo || '',
                companySignatureUrl: type === 'signature' ? '' : updatedCompanyData.companySignatureUrl || '',
                companySealUrl: type === 'seal' ? '' : updatedCompanyData.companySealUrl || '',
            });

            // Optimistically update UI
            if (type === 'logo') {
              setLogoPreview(null);
              setLogoFile(null);
            } else if (type === 'signature') {
              setSignaturePreview(null);
              setSignatureFile(null);
            } else {
              setSealPreview(null);
              setSealFile(null);
            }
            setCompany(updatedCompanyData);

            toast({ title: 'Image Deleted', description: `The company ${type} has been removed.` });
        }
    } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
        toast({ title: 'Error', description: `Could not delete the ${type}.`, variant: 'destructive' });
    } finally {
        setImageToDelete(null);
    }
};

  const ImageUpload = ({ type, label, displayUrl, placeholder, onFileChange, onEdit, onDelete }: {
    type: 'logo' | 'signature' | 'seal',
    label: string,
    displayUrl: string | null,
    placeholder: string,
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
    onEdit: () => void,
    onDelete: () => void,
  }) => {
    const inputRef = type === 'logo' ? logoInputRef : (type === 'signature' ? signatureInputRef : sealInputRef);
    const hasImage = displayUrl && !displayUrl.includes('placeholder-icon');

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="relative w-fit group">
            <Image 
              src={displayUrl || placeholder} 
              alt={label} 
              width={type === 'signature' ? 240 : 150} 
              height={150} 
              className="rounded-md border p-2 bg-gray-50 object-contain h-[150px]" 
              data-ai-hint={type} 
              unoptimized 
            />
            {hasImage && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                   <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onEdit}>
                        <Pencil className="h-5 w-5" />
                   </Button>
                   <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onDelete}>
                            <Trash2 className="h-5 w-5" />
                       </Button>
                   </AlertDialogTrigger>
                </div>
            )}
        </div>
        <Input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          onChange={onFileChange}
          className="hidden"
        />
         {!hasImage && (
             <Button variant="outline" size="sm" onClick={onEdit}>Upload Image</Button>
         )}
      </div>
    );
  };
  
  const logoPlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'company-logo'
  )?.imageUrl || 'https://icon-library.com/images/image-placeholder-icon/image-placeholder-icon-3.jpg';

  const signaturePlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'company-signature'
  )?.imageUrl || 'https://icon-library.com/images/image-placeholder-icon/image-placeholder-icon-3.jpg';
  
  const sealPlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'company-seal'
  )?.imageUrl || 'https://icon-library.com/images/image-placeholder-icon/image-placeholder-icon-3.jpg';

  const displayLogoUrl = logoPreview
    || (company.companyLogo ? `${BASE_URL}/${company.companyLogo}` : null);

  const displaySignatureUrl = signaturePreview 
    || (company.companySignatureUrl ? `${BASE_URL}/${company.companySignatureUrl}` : null);
  
  const displaySealUrl = sealPreview 
    || (company.companySealUrl ? `${BASE_URL}/${company.companySealUrl}` : null);


  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title="Settings"
        description="Manage your company details and application settings."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <AlertDialog>
          <Tabs defaultValue="office">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="office">Office</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="bank">Bank</TabsTrigger>
            </TabsList>
            <TabsContent value="office">
              <Card>
                <CardHeader>
                  <CardTitle>Office Details</CardTitle>
                  <CardDescription>
                    Update your company's public information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" value={company.companyName || ''} onChange={(e) => handleInputChange('companyName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={company.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={company.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={company.phoneNumber || ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <ImageUpload
                          type="logo"
                          label="Company Logo"
                          displayUrl={displayLogoUrl}
                          placeholder={logoPlaceholder}
                          onFileChange={(e) => handleFileChange(e, 'logo')}
                          onEdit={() => logoInputRef.current?.click()}
                          onDelete={() => setImageToDelete({type: 'logo', url: company.companyLogo || null})}
                      />
                      <ImageUpload
                          type="signature"
                          label="Company Signature"
                          displayUrl={displaySignatureUrl}
                          placeholder={signaturePlaceholder}
                          onFileChange={(e) => handleFileChange(e, 'signature')}
                          onEdit={() => signatureInputRef.current?.click()}
                          onDelete={() => setImageToDelete({type: 'signature', url: company.companySignatureUrl || null})}
                      />
                      <ImageUpload
                          type="seal"
                          label="Company Seal"
                          displayUrl={displaySealUrl}
                          placeholder={sealPlaceholder}
                          onFileChange={(e) => handleFileChange(e, 'seal')}
                          onEdit={() => sealInputRef.current?.click()}
                          onDelete={() => setImageToDelete({type: 'seal', url: company.companySealUrl || null})}
                      />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges('office')}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="tax">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Details</CardTitle>
                  <CardDescription>
                    Manage your company's tax information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID / GSTIN</Label>
                    <Input id="tax-id" value={company.taxId || ''} onChange={(e) => handleInputChange('taxId', e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges('tax')}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>
                    Update your company's bank account for payments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="acc-Holder-Name">Account Holder Name</Label>
                    <Input id="acc-Holder-Name" value={company.accHolderName || company.companyName || ''} onChange={(e) => handleInputChange('accHolderName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" value={company.branch || ''} onChange={(e) => handleInputChange('branch', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" value={company.accountNumber || ''} onChange={(e) => handleInputChange('accountNumber', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC</Label>
                    <Input id="ifsc-code" value={company.ifsc || ''} onChange={(e) => handleInputChange('ifsc', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input id="upi-id" value={company.upiId || ''} onChange={(e) => handleInputChange('upiId', e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveChanges('bank')}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action will permanently delete the company {imageToDelete?.type}. This cannot be undone.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setImageToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteImage}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
