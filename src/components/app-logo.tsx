import { Briefcase } from 'lucide-react';

export default function AppLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Briefcase className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-bold text-foreground">
        OfficeFlow
      </h1>
    </div>
  );
}
