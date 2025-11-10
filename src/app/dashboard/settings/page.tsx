'use client';

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

export default function SettingsPage() {
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
                  <Input id="name" defaultValue="KeeRa Innovations" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Business Ave, Suite 100, Metro City, 12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input id="contact" defaultValue="contact@keerainnovations.com | +1 234 567 890" />
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
                <Button>Save Changes</Button>
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
                  <Input id="tax-id" defaultValue="12-3456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number</Label>
                  <Input id="vat" defaultValue="GB123456789" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
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
                  <Input id="bank-name" defaultValue="Global Commerce Bank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" defaultValue="**** **** **** 1234" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="swift-code">SWIFT / BIC Code</Label>
                  <Input id="swift-code" defaultValue="GCBKGBA" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
