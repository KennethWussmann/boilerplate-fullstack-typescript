import type { ReactNode } from 'react';

export const MarkdownPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-4xl">{children}</div>
    </div>
  );
};
