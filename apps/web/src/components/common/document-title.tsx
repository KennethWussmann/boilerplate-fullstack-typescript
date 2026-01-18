import { useEffect } from 'react';
import { useMatches } from 'react-router';
import { productName } from '@/lib';

type RouteHandle = {
  title?:
    | string
    | ((args: { params: Record<string, string | undefined>; data: unknown }) => string);
};

export const DocumentTitle = () => {
  const matches = useMatches();

  useEffect(() => {
    const lastWithTitle = [...matches]
      .reverse()
      .find((m) => (m.handle as RouteHandle | undefined)?.title);

    if (!lastWithTitle) {
      document.title = productName;
      return;
    }

    const handle = lastWithTitle.handle as RouteHandle | undefined;
    const title =
      typeof handle?.title === 'function'
        ? handle.title({ params: lastWithTitle.params, data: lastWithTitle.data })
        : handle?.title;

    document.title = title ? `${title} · ${productName}` : productName;
  }, [matches]);

  return null;
};
