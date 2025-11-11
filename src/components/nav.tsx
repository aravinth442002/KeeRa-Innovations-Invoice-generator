'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  FileQuestion,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Database,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  {
    href: '/dashboard/purchase-orders',
    icon: ShoppingCart,
    label: 'Purchase Orders',
  },
  { href: '/dashboard/quotations', icon: FileQuestion, label: 'Quotations' },
  { href: '/dashboard/master', icon: Database, label: 'Master' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
              tooltip={item.label}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

    