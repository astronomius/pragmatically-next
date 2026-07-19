import { ServerCrash } from 'lucide-react';

export default async function BuggyServerComponent({
  shouldCrash,
}: {
  shouldCrash: boolean;
}) {
  // Simulate a delay so the boundary loading state (if any) could be seen,
  // or just to mimic a network request.
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (shouldCrash) {
    throw new Error('Server Component crashed during rendering! The database query failed.');
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4 bg-card text-sm text-foreground">
      <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500">
        <ServerCrash className="h-4 w-4" />
      </div>
      <div>
        <p className="font-semibold">Server Component</p>
        <p className="text-muted-foreground text-xs mt-0.5">Rendered successfully on the server.</p>
      </div>
    </div>
  );
}
