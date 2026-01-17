import { useIsMobile } from '@/lib/utils';
import { DashboardLayout } from './dashboard-layout';
import { MobileAppLayout } from './mobile-app-layout';

export const ResponsiveDashboardLayout = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileAppLayout />;
  }

  return <DashboardLayout />;
};
