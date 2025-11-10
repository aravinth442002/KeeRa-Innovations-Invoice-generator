'use client';

import { useState } from 'react';
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

export default function SettingsPage() {
  const { toast } = useToast();
  
  // Office State
  const [companyName, setCompanyName] = useState('KeeRa Innovations');
  const [address, setAddress] = useState('112-A, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600042');
  const [contact, setContact] = useState('keerainnovations@gmail.com | +1 234 567 890');
  
  // Tax State
  const [taxId, setTaxId] = useState('12-3456789');
  const [vatNumber, setVatNumber] = useState('GB123456789');
  
  // Bank State
  const [bankName, setBankName] = useState('Global Commerce Bank');
  const [accountNumber, setAccountNumber] = useState('**** **** **** 1234');
  const [swiftCode, setSwiftCode] = useState('GCBKGBA');
  
  const signatureImg = PlaceHolderImages.find(
    (img) => img.id === 'company-signature'
  );
  const sealImg = PlaceHolderImages.find(
    (img) => img.id === 'company-seal'
  );

  const handleSaveChanges = (section: string) => {
    // In a real application, you would make an API call here to save the data.
    toast({
      title: 'Settings Saved',
      description: `Your ${section} details have been updated.`,
    });
  };


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
                  <Input id="name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
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
                  <Label htmlFor="tax-id">Tax ID / EIN</Label>
                  <Input id="tax-id" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number</Label>
                  <Input id="vat" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
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
                  <Input id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="swift-code">SWIFT / BIC Code</Label>
                  <Input id="swift-code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
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
