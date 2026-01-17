import { FileQuestion, Home } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { track } from '@/lib';

export const NotFoundPage = () => {
  useEffect(() => {
    track('page_not_found', {
      props: {
        path: document.location.pathname,
      },
    });
  }, []);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-lg bg-muted p-4">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Page Not Found</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button size="lg" className="mt-8" asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};
