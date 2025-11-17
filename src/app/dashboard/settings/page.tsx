'use client';

import { useState, useEffect } from 'react';
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
  swiftBicCode: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Partial<Company>>({});

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      // Assuming you only have one company profile to manage
      if (response.data && response.data.length > 0) {
        setCompany(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch company details.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof Company, value: string) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (section: string) => {
    try {
      if (company._id) {
        // Update existing company
        await axios.put(`${API_URL}/companies/${company._id}`, company);
      } else {
        // Create new company
        const response = await axios.post(`${API_URL}/companies`, company);
        setCompany(response.data); // update state with new data including _id
      }
      toast({
        title: 'Settings Saved',
        description: `Your ${section} details have been updated.`,
      });
    } catch (error) {
      console.error(`Failed to save ${section} details:`, error);
      toast({
        title: 'Error',
        description: `Could not save ${section} details.`,
        variant: 'destructive',
      });
    }
  };
  
  const signatureImg = PlaceHolderImages.find(
    (img) => img.id === 'company-signature'
  );
  const sealImg = PlaceHolderImages.find(
    (img) => img.id === 'company-seal'
  );

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
                        {signatureImg && <Image src={signatureImg.imageUrl} alt={signatureImg.description} width={240} height={100} className="rounded-md border p-2" data-ai-hint={signatureImg.imageHint}/>}
                        <Input type="file" />
                    </div>
                    <div className="space-y-2">
                        <Label>Company Seal</Label>
                        {sealImg && <Image src={sealImg.imageUrl} alt={sealImg.description} width={150} height={150} className="rounded-md border p-2" data-ai-hint={sealImg.imageHint}/>}
                        <Input type="file" />
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
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" value={company.bankName || ''} onChange={(e) => handleInputChange('bankName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" value={company.accountNumber || ''} onChange={(e) => handleInputChange('accountNumber', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="swift-code">SWIFT / BIC Code</Label>
                  <Input id="swift-code" value={company.swiftBicCode || ''} onChange={(e) => handleInputChange('swiftBicCode', e.target.value)} />
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
