"use client";

import React, { useState, useTransition } from "react";
import { Log } from "@/lib/db";
import { fetchMoreLogsAction } from "@/app/advanced/scroller/actions";
import { 
  Terminal, 
  RotateCw, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Layers
} from "lucide-react";

interface ScrollerContainerProps {
  initialLogs: Log[];
  initialHasMore: boolean;
}

export default function ScrollerContainer({ initialLogs, initialHasMore }: ScrollerContainerProps) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [offset, setOffset] = useState(initialLogs.length);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const limit = 4;
      const result = await fetchMoreLogsAction(offset, limit);
      if (result.success) {
        setLogs((prev) => [...prev, ...result.data]);
        setHasMore(result.hasMore);
        setOffset((prev) => prev + limit);
      } else {
        alert(result.error || "Failed to load more logs.");
      }
    });
  };

  // Log level styling helper
  const getLevelBadge = (level: Log["level"]) => {
    switch (level) {
      case "ERROR":
        return {
          text: "text-red-400 bg-red-400/10 border-red-500/20",
          icon: AlertCircle
        };
      case "WARNING":
        return {
          text: "text-amber-400 bg-amber-400/10 border-amber-500/20",
          icon: AlertTriangle
        };
      case "INFO":
      default:
        return {
          text: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
          icon: Info
        };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Log Console Container */}
      <div className="rounded-xl border border-border bg-zinc-950 p-6 font-mono text-xs text-zinc-300 shadow-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-zinc-500">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Server Logs Terminal Context</span>
          </div>
          <span className="text-[10px] font-semibold bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">
            Render count: {logs.length}
          </span>
        </div>

        {/* Console output display */}
        <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const levelStyle = getLevelBadge(log.level);
            const Icon = levelStyle.icon;

            return (
              <div 
                key={log.id} 
                className="flex flex-col sm:flex-row sm:items-start gap-2 py-2.5 px-3 rounded bg-zinc-900/50 border border-zinc-900 hover:bg-zinc-900 transition-colors"
              >
                {/* Time stamp */}
                <span className="text-zinc-600 shrink-0 select-none">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

                {/* Level badge */}
                <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold border ${levelStyle.text} shrink-0`}>
                  <Icon className="h-3 w-3" />
                  {log.level}
                </span>

                {/* Service emitter */}
                <span className="text-indigo-400 font-bold shrink-0">
                  [{log.service}]
                </span>

                {/* Message */}
                <span className="text-zinc-300 break-all">
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>

        {/* Load more dispatcher button */}
        <div className="mt-6 flex justify-center border-t border-zinc-900 pt-4">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-6 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin text-primary" : ""}`} />
              <span>{isPending ? "Connecting & Streaming..." : "Load More Logs"}</span>
            </button>
          ) : (
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              -- End of Logs stream buffer --
            </span>
          )}
        </div>
      </div>

      {/* Lab detail warnings panel */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Layers className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-foreground">Why this matters:</span> Asynchronous pagination queries can block client UI updates if not handled correctly. Wrapping the Server Action call in React 19&apos;s <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">useTransition</code> hook ensures that the main thread stays interactive and responsive during the network delay, preventing layout shifts or freezing pages.
        </div>
      </div>
    </div>
  );
}
