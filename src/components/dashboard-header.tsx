import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardHeader({
  title,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 p-4 sm:p-6">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
        <div className="grid gap-1">
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
