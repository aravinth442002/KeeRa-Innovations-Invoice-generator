import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, CreditCard, Users } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';

const summaryData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    title: 'Active Clients',
    value: '+2350',
    change: '+180.1% from last month',
    icon: Users,
  },
  {
    title: 'Pending Orders',
    value: '+12',
    change: '+19% from last month',
    icon: Package,
  },
  {
    title: 'Overdue Invoices',
    value: '3',
    change: '+2 since last month',
    icon: CreditCard,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title="Dashboard"
        description="Here's a quick overview of your business."
      />
      <main className="flex-1 space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryData.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to OfficeFlow!</CardTitle>
            <CardDescription>
              Your all-in-one solution for managing invoices, purchase orders, and
              quotations. Explore the sections on the left to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You can start by creating a new invoice, importing one using our AI
              tool, or configuring your company details in the settings.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
