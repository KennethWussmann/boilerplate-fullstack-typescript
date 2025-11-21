import { ApolloProvider } from '@apollo/client/react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { apolloClient } from '@/lib/';
import { Home } from '@/pages/home';
import { Toaster } from './components/ui/sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Toaster />
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;
