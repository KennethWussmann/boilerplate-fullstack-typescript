import { Link, Outlet } from 'react-router';
import { DefaultToolbar, DocumentTitle, SlotTarget } from '@/components';
import { Logo } from '@/components/common/logo';
import { useNavigation } from '@/components/common/navigation';
import { Button } from '@/components/ui';
import { track } from '@/lib';
import { footerEnabled, legalUrl, privacyPolicyUrl, productName } from '@/lib/constants';

export const PublicLayout = () => {
  const { items } = useNavigation('public');

  return (
    <>
      {' '}
      <DocumentTitle />
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Logo className="h-6 w-6" />
              {productName}
            </Link>
            <nav className="flex items-center gap-4">
              {items.map((item) => (
                <Button key={item.id} variant="ghost" asChild>
                  <Link
                    to={item.href}
                    target={item.external ? '_blank' : undefined}
                    onClick={() => {
                      track('public_layout_nav_click', { props: { item: item.name } });
                    }}
                  >
                    {item.name}
                  </Link>
                </Button>
              ))}
              <SlotTarget name="toolbar" fallback={<DefaultToolbar />} />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        {footerEnabled && (
          <footer className="border-t py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <div>
                {productName} {new Date().getFullYear()}
              </div>
              {(legalUrl || privacyPolicyUrl) && (
                <div className="mt-2 flex items-center justify-center gap-4">
                  {legalUrl && (
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
                  )}
                  {legalUrl && privacyPolicyUrl && <span>•</span>}
                  {privacyPolicyUrl && (
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
                  )}
                </div>
              )}
            </div>
          </footer>
        )}
      </div>
    </>
  );
};
