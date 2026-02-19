import { ArrowRight, Code2, Database, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Card } from '@/components/ui';
import { track } from '@/lib';
import { githubUrl, productNameSlug } from '@/lib/constants';

export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">{productNameSlug}</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          A modern, production-ready starter template with React, GraphQL, and TypeScript
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/dashboard" onClick={() => track('home_hero_cta_click')}>
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            onClick={() => track('home_hero_github_click')}
          >
            <a href={githubUrl ?? undefined} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-5xl gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
            <Code2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Modern Stack</h3>
          <p className="text-sm text-muted-foreground">
            Built with React 19, Vite, Tailwind CSS, and TypeScript for type-safe development
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">GraphQL API</h3>
          <p className="text-sm text-muted-foreground">
            Full GraphQL integration with Apollo Client, queries, mutations, and subscriptions
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Production Ready</h3>
          <p className="text-sm text-muted-foreground">
            Docker support, CI/CD workflows, code quality tools, and best practices included
          </p>
        </Card>
      </div>
    </div>
  );
};
