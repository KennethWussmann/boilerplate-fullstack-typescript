import { Activity, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  DefaultToolbar,
  DocumentTitle,
  ErrorBoundary,
  ShortcutKeys,
  SlotTarget,
} from '@/components';
import { useNavigation } from '@/components/common/navigation';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui';
import { track } from '@/lib';
import { legalUrl, privacyPolicyUrl, productName } from '@/lib/constants';
import { useGlobalShortcuts } from '@/lib/shortcuts';
import { cn } from '@/lib/utils';

export const DashboardLayout = () => {
  useGlobalShortcuts();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { groups, active } = useNavigation('dashboard');

  const NavigationLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          {group.label && (
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </div>
          )}
          {group.items.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', isActive && 'bg-secondary')}
                asChild
              >
                <Link
                  to={item.href}
                  target={item.external ? '_blank' : undefined}
                  onClick={() => {
                    track('dashboard_layout_nav_click', { props: { item: item.name } });
                    onNavigate?.();
                  }}
                  className="flex flex-row justify-between w-full"
                  viewTransition
                >
                  <div className="flex flex-row gap-4 items-center">
                    {Icon && <Icon className="size-6" />}
                    {item.name}
                  </div>
                  {item.shortcut && <ShortcutKeys shortcut={item.shortcut} className="ml-auto" />}
                </Link>
              </Button>
            );
          })}
        </div>
      ))}
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

  const NavBarHeader = () => {
    return (
      <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
        <Activity className="h-6 w-6" />
        {productName}
      </Link>
    );
  };

  return (
    <ErrorBoundary>
      <DocumentTitle />
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 border-r bg-muted/10 md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <NavBarHeader />
            </div>
            <nav className="flex-1 space-y-4 p-4">
              <NavigationLinks />
            </nav>
            <div className="border-t p-4 space-y-4">
              <FooterLinks />
            </div>
          </div>
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex flex-row items-center">
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
                <SlotTarget name="title" fallback={active?.name || 'Dashboard'} />
              </h1>
            </div>
            <SlotTarget name="toolbar" fallback={<DefaultToolbar />} />
          </header>
          <main className="flex min-h-0 flex-1 flex-col overflow-auto">
            <div className="flex-1 p-4">
              <Outlet />
            </div>
          </main>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle asChild>
                <NavBarHeader />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 space-y-4 p-4">
              <NavigationLinks onNavigate={() => setMobileMenuOpen(false)} />
            </nav>
            <div className="border-t p-4 space-y-4">
              <FooterLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ErrorBoundary>
  );
};
