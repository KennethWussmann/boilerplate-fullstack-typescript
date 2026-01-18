import { Link, Outlet, useLocation } from 'react-router';
import { DefaultToolbar, ErrorBoundary, SlotTarget } from '@/components';
import { useNavigation } from '@/components/common/navigation';
import { track } from '@/lib';
import { useGlobalShortcuts } from '@/lib/shortcuts';
import { cn } from '@/lib/utils';

export const MobileAppLayout = () => {
  useGlobalShortcuts();
  const location = useLocation();
  const { items, active } = useNavigation('dashboard');

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <h1 className="text-lg font-semibold">
            <SlotTarget name="title" fallback={active?.name || 'Dashboard'} />
          </h1>
          <SlotTarget name="toolbar" fallback={<DefaultToolbar />} />
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-auto">
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </main>
        <nav className="shrink-0 border-t bg-background">
          <div className="flex h-16 items-center justify-around px-2">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => {
                    track('mobile_layout_nav_click', { props: { item: item.name } });
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="size-5" />}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </ErrorBoundary>
  );
};
