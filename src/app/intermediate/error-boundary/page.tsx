import React from 'react';
import Link from 'next/link';
import LabExplanation from '@/components/lab-explanation';
import BuggyServerComponent from './buggy-server-component';
import BuggyClientComponent from './buggy-client-component';
import { ComponentErrorBoundary } from './component-error-boundary';
import ErrorFallback from './error-fallback';
import { ArrowRight, Info } from 'lucide-react';

export default async function ErrorBoundaryPage({
  searchParams,
}: {
  searchParams: Promise<{ crash?: string }>;
}) {
  const params = await searchParams;
  const shouldCrashServer = params.crash === 'true';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intermediate Lab: Error Boundaries
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice catching and recovering from rendering errors in both Server and Client components using Next.js <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">error.tsx</code>.
        </p>
      </div>

      {/* Lab Explanation */}
      <LabExplanation labSlug="error-boundary" />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Interactive Error Playground</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Trigger errors below. We wrapped each component in a custom <code className="bg-muted px-1 rounded">ComponentErrorBoundary</code>. When one crashes, only that component is replaced with a fallback UI, allowing the other to keep running perfectly!
          </p>

          <div className="grid gap-4">
            <ComponentErrorBoundary fallback={ErrorFallback}>
              <BuggyServerComponent shouldCrash={shouldCrashServer} />
            </ComponentErrorBoundary>
            
            <ComponentErrorBoundary fallback={ErrorFallback}>
              <BuggyClientComponent />
            </ComponentErrorBoundary>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg border border-border/50">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Server Errors require URL changes to simulate</p>
              <p className="mb-2">Because Server Components only render on the server (e.g. during a navigation), we must navigate to a URL that tells the server to crash during rendering.</p>
              <Link 
                href="/intermediate/error-boundary?crash=true"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded"
              >
                Trigger Server Crash <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}