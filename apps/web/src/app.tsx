import type { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router';
import { DashboardLayout, PublicLayout } from '@/layouts';
import { AnalyticsProvider, apolloClient, ThemeProvider } from '@/lib/';
import { DashboardPage } from '@/pages/dashboard-page';
import { DevToolsPage } from '@/pages/dev-tools-page';
import { HomePage } from '@/pages/home-page';
import { SettingsPage } from '@/pages/settings-page';
import { PWAPrompt } from './components';
import { CookieBanner } from './components/common/cookie-banner';
import { Toaster } from './components/ui/sonner';
import { isHashBasedRouting } from './lib/constants';

const routes = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/dev-tools',
        element: <DevToolsPage />,
      },
    ],
  },
];
const router = isHashBasedRouting ? createHashRouter(routes) : createBrowserRouter(routes);

function AppWithoutGraphQL() {
  return (
    <>
      <AnalyticsProvider />
      <PWAPrompt />
      <Toaster />
      <CookieBanner />
      <RouterProvider router={router} />
    </>
  );
}

function AppWithGraphQL({ client }: { client: ApolloClient }) {
  return (
    <ApolloProvider client={client}>
      <AppWithoutGraphQL />
    </ApolloProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      {apolloClient ? <AppWithGraphQL client={apolloClient} /> : <AppWithoutGraphQL />}
    </ThemeProvider>
  );
}

export default App;
