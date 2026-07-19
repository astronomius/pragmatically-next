'use client';

import { useState } from 'react';
import { MonitorX } from 'lucide-react';

export default function BuggyClientComponent() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('Client Component crashed during rendering! The button was clicked.');
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 bg-card text-sm text-foreground">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
          <MonitorX className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold">Client Component</p>
          <p className="text-muted-foreground text-xs mt-0.5">Rendered successfully on the client.</p>
        </div>
      </div>
      <button
        onClick={() => setShouldCrash(true)}
        className="rounded bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
      >
        Crash Client
      </button>
    </div>
  );
}
