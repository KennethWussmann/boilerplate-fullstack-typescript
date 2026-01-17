import { Link, Outlet } from 'react-router';
import { Button } from '@/components/ui';
import { ThemeDropdownMenu, track } from '@/lib';
import { legalUrl, privacyPolicyUrl, productName } from '@/lib/constants';

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
              <Link
                to="/dashboard"
                onClick={() => {
                  track('public_layout_cta_click');
                }}
              >
                Dashboard
              </Link>
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
          <div>
            {productName} {new Date().getFullYear()}
          </div>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link
              to={legalUrl}
              target="_blank"
              className="hover:underline"
              onClick={() => {
                track('public_layout_legal_click');
              }}
            >
              Legal
            </Link>
            <span>•</span>
            <Link
              to={privacyPolicyUrl}
              target="_blank"
              className="hover:underline"
              onClick={() => {
                track('public_layout_privacy_click');
              }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
