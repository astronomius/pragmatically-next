'use client';

import { startTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorFallback({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error caught by Next.js Error Boundary:', error);
    }, [error]);

    const handleTryAgain = () => {
        // If the error was caused by a URL search param, trying again without clearing the param
        // will just crash the server component again. We can remove the query param here to be safe,
        // or just let reset() do its thing for client-side errors.

        // For this lab, if it's a server error triggered by ?crash=true, we should clear it.
        // If it's a client error, reset() will re-render the segment (and our client state will reset).
        if (window.location.search.includes('crash=true')) {
            console.log("this is true")
            router.replace('/intermediate/error-boundary');
            // We still need to call reset to trigger a re-render of the error boundary's children
            // after the navigation happens.
            startTransition(() => {
                reset()
            })
        } else {
            reset()
        }
    };

    return (
        <div className="rounded-xl border border-red-500/20 bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="rounded-full bg-red-500/10 p-4 text-red-500">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground">Something went wrong!</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    An error was thrown and caught by our custom <code className="bg-muted px-1 rounded">ComponentErrorBoundary</code> without crashing the entire page layout!
                </p>
            </div>

            <div className="bg-muted/50 border border-border p-3 rounded-md w-full max-w-md text-left overflow-hidden">
                <p className="text-xs font-mono text-red-400 break-words">
                    {error.message || 'Unknown error occurred'}
                </p>
            </div>

            <button
                onClick={handleTryAgain}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
                <RotateCcw className="h-4 w-4" />
                Try Again
            </button>
        </div>
    );
}
