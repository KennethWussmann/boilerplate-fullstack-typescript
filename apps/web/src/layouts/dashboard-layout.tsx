import { Activity, Home, Settings } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';
import { Button } from '@/components/ui';
import { track } from '@/lib';
import { legalUrl, privacyPolicyUrl, productName } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const DashboardLayout = () => {
  const location = useLocation();

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
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>
          <div className="border-t p-4 space-y-4">
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
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-6">
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
    </div>
  );
};
