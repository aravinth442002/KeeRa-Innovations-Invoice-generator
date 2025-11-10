import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function UserNav() {
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar'
  );

  return (
    <div className="flex items-center gap-2">
      {userAvatar && (
        <Image
          src={userAvatar.imageUrl}
          alt={userAvatar.description}
          width={36}
          height={36}
          className="rounded-full"
          data-ai-hint={userAvatar.imageHint}
        />
      )}
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium text-sidebar-foreground">
          Demo User
        </p>
        <p className="truncate text-xs text-sidebar-foreground/70">
          demo@officeflow.com
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogOut className="mr-2" />
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
