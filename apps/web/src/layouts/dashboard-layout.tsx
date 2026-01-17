import { Activity, Home, Menu, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui';
import { track } from '@/lib';
import { legalUrl, privacyPolicyUrl, productName } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavigationLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', isActive && 'bg-secondary')}
            asChild
          >
            <Link
              to={item.href}
              onClick={() => {
                track('dashboard_layout_nav_click', { props: { item: item.name } });
                onNavigate?.();
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </>
  );

  const FooterLinks = () => (
    <>
      <div className="flex flex-row justify-center gap-2 text-xs text-muted-foreground">
        <Link
          to={legalUrl}
          target="_blank"
          className="hover:underline"
          onClick={() => {
            track('dashboard_layout_legal_click');
          }}
        >
          Legal
        </Link>
        <Link
          to={privacyPolicyUrl}
          target="_blank"
          className="hover:underline"
          onClick={() => {
            track('dashboard_layout_privacy_click');
          }}
        >
          Privacy Policy
        </Link>
      </div>
      <Button variant="outline" className="w-full" asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-muted/10 md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Activity className="h-6 w-6" />
              {productName}
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <NavigationLinks />
          </nav>
          <div className="border-t p-4 space-y-4">
            <FooterLinks />
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <h1 className="text-lg font-semibold">
            {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle asChild>
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Activity className="h-6 w-6" />
                {productName}
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex-1 space-y-1 p-4">
            <NavigationLinks onNavigate={() => setMobileMenuOpen(false)} />
          </nav>
          <div className="border-t p-4 space-y-4">
            <FooterLinks />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
