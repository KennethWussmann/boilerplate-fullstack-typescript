import type { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import {
  createBrowserRouter,
  createHashRouter,
  type RouteObject,
  RouterProvider,
} from 'react-router';
import { PublicLayout, ResponsiveDashboardLayout } from '@/layouts';
import { AnalyticsProvider, apolloClient, ThemeProvider } from '@/lib/';
import { DashboardPage } from '@/pages/dashboard-page';
import { DevToolsPage } from '@/pages/dev-tools-page';
import { HomePage } from '@/pages/home-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { SettingsPage } from '@/pages/settings-page';
import { ErrorBoundaryProvider, LayoutSlotsProvider, PWAPrompt } from './components';
import { CookieBanner } from './components/common/cookie-banner';
import { Toaster } from './components/ui/sonner';
import { isHashBasedRouting } from './lib/constants';
import { DocsPage } from './pages/docs';

const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: { title: 'Not Found' },
      },
    ],
  },
  {
    element: <ResponsiveDashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
        handle: { title: 'Dashboard' },
      },
      {
        path: '/settings',
        element: <SettingsPage />,
        handle: { title: 'Settings' },
      },
      {
        path: '/docs',
        element: <DocsPage />,
        handle: { title: 'Documentation' },
      },
      {
        path: '/dev-tools',
        element: <DevToolsPage />,
        handle: { title: 'Developer' },
      },
    ],
  },
];
const router = isHashBasedRouting ? createHashRouter(routes) : createBrowserRouter(routes);

const AppWithoutGraphQL = () => {
  return (
    <>
      <AnalyticsProvider />
      <PWAPrompt />
      <Toaster />
      <CookieBanner />
      <LayoutSlotsProvider>
        <RouterProvider router={router} />
      </LayoutSlotsProvider>
    </>
  );
};

const AppWithGraphQL = ({ client }: { client: ApolloClient }) => {
  return (
    <ApolloProvider client={client}>
      <AppWithoutGraphQL />
    </ApolloProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ErrorBoundaryProvider>
        {apolloClient ? <AppWithGraphQL client={apolloClient} /> : <AppWithoutGraphQL />}
      </ErrorBoundaryProvider>
    </ThemeProvider>
  );
};

export default App;
