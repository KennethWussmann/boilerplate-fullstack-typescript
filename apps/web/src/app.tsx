import { ApolloProvider } from '@apollo/client/react';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router';
import { DashboardLayout, PublicLayout } from '@/layouts';
import { apolloClient } from '@/lib/';
import { DashboardPage } from '@/pages/dashboard-page';
import { HomePage } from '@/pages/home-page';
import { SettingsPage } from '@/pages/settings-page';
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
    ],
  },
];
const router = isHashBasedRouting ? createHashRouter(routes) : createBrowserRouter(routes);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Toaster />
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;
