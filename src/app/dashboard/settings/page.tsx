
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const BASE_URL = API_URL.replace('/api', '');


type Company = {
  _id: string;
  companyName: string;
  address: string;
  email: string;
  phoneNumber: string;
  companySignatureUrl: string;
  companySealUrl: string;
  taxId: string;
  vatNumber: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Partial<Company>>({});
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [sealPreview, setSealPreview] = useState<string | null>(null);


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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'signature' | 'seal') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (fileType === 'signature') {
        setSignatureFile(file);
        setSignaturePreview(previewUrl);
      } else {
        setSealFile(file);
        setSealPreview(previewUrl);
      }
    }
  };
  
  const handleSaveChanges = async (section: string) => {
    const formData = new FormData();

    Object.entries(company).forEach(([key, value]) => {
        if(value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

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
      fetchCompanyData(); // Re-fetch to display updated images if any
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
  
  const signaturePlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'company-signature'
  )?.imageUrl;
  
  const sealPlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'company-seal'
  )?.imageUrl;

  const displaySignatureUrl = signaturePreview 
    || (company.companySignatureUrl ? `${BASE_URL}/${company.companySignatureUrl}` : signaturePlaceholder);
  
  const displaySealUrl = sealPreview 
    || (company.companySealUrl ? `${BASE_URL}/${company.companySealUrl}` : sealPlaceholder);


  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title="Settings"
        description="Manage your company details and application settings."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Company Signature</Label>
                        {displaySignatureUrl && <Image src={displaySignatureUrl} alt="Company Signature" width={240} height={100} className="rounded-md border p-2" data-ai-hint="signature" unoptimized />}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'signature')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Company Seal</Label>
                        {displaySealUrl && <Image src={displaySealUrl} alt="Company Seal" width={150} height={150} className="rounded-md border p-2" data-ai-hint="seal" unoptimized />}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'seal')} />
                    </div>
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
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number</Label>
                  <Input id="vat" value={company.vatNumber || ''} onChange={(e) => handleInputChange('vatNumber', e.target.value)} />
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
                  <Label htmlFor="bank-name">Name</Label>
                  <Input id="bank-name" value={company.bankName || ''} onChange={(e) => handleInputChange('bankName', e.target.value)} />
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
      </main>
    </div>
  );
}
