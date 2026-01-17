import { Link, Outlet } from 'react-router';
import { Button } from '@/components/ui';
import { ThemeDropdownMenu } from '@/lib';
import { productName } from '@/lib/constants';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold">
            {productName}
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <ThemeDropdownMenu />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {productName} - A modern starter template
        </div>
      </footer>
    </div>
  );
};
