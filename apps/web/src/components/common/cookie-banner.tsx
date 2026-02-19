import { useAtom } from 'jotai/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { settings } from '@/lib';
import { plausibleDomain, plausibleEndpoint, privacyPolicyUrl } from '@/lib/constants';

export const CookieBanner = () => {
  const [isEnabled, setEnabled] = useAtom(settings.analytics.enabled);
  const [dismissUntil, setDismissUntil] = useAtom(settings.analytics.dismissConsentBannerUntil);

  const shouldShow = useMemo(() => {
    if (!plausibleDomain || !plausibleEndpoint) {
      return false;
    }

    if (isEnabled) {
      return false;
    }

    if (!dismissUntil) {
      return true;
    }

    const dismissDate = new Date(dismissUntil);
    const now = new Date();
    return now > dismissDate;
  }, [isEnabled, dismissUntil]);

  const onAccept = () => {
    setEnabled(true);
    setDismissUntil(undefined);
  };

  const onReject = () => {
    setEnabled(false);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    setDismissUntil(futureDate.toISOString());
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-md gap-4 py-4 shadow-lg">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-base">Cookie Consent</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-0">
        <p className="text-sm">
          We use cookies to improve your experience and analyze site usage. By accepting, you agree
          to our use of cookies.
        </p>
        <a href={privacyPolicyUrl ?? undefined} className="text-xs text-muted-foreground">
          Privacy Policy
        </a>
      </CardContent>
      <CardFooter className="flex gap-2 px-4 pt-0">
        <Button variant="ghost" onClick={onReject} className="flex-1">
          Reject
        </Button>
        <Button onClick={onAccept} className="flex-1">
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};
