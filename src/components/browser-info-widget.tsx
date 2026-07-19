"use client";

import React from "react";
import { Monitor, Cpu, Globe } from "lucide-react";

// Module-level singleton — evaluated once when this chunk loads in the browser.
// This component is ONLY ever mounted with { ssr: false } so `window` / `navigator`
// are always available at evaluation time.
const INFO =
  typeof navigator !== "undefined"
    ? {
        userAgent: navigator.userAgent.substring(0, 60) + "…",
        language: navigator.language,
        cores: navigator.hardwareConcurrency ?? 0,
        online: navigator.onLine,
      }
    : null;

/**
 * BrowserInfoWidget — reads window.navigator properties.
 * Must be loaded with { ssr: false } via next/dynamic because
 * `window` and `navigator` do not exist in the Node.js render environment.
 *
 * We read navigator at module evaluation time (not in a hook) so the
 * value is available on the very first render without triggering effects.
 */
export default function BrowserInfoWidget() {
  if (!INFO) {
    return (
      <div className="p-4 text-xs text-muted-foreground flex items-center gap-2">
        <span className="text-primary">⟳</span>
        Reading browser environment…
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[11px] font-bold text-foreground uppercase tracking-wider">
        <Monitor className="h-3.5 w-3.5 text-emerald-500" />
        Browser Environment (window.navigator)
      </div>

      <div className="grid grid-cols-1 gap-2 text-[11px]">
        <div className="flex items-start gap-2">
          <Globe className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-muted-foreground">Language: </span>
            <span className="font-mono text-foreground">{INFO.language}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Cpu className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-muted-foreground">CPU Cores: </span>
            <span className="font-mono text-foreground">{INFO.cores}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="h-3.5 w-3.5 mt-0.5 shrink-0 flex items-center justify-center">
            <span
              className={`h-2 w-2 rounded-full ${
                INFO.online ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </span>
          <div>
            <span className="text-muted-foreground">Network: </span>
            <span
              className={`font-mono font-bold ${
                INFO.online ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {INFO.online ? "online" : "offline"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 col-span-full">
          <span className="text-muted-foreground shrink-0">UA:</span>
          <span className="font-mono text-[10px] text-muted-foreground break-all">
            {INFO.userAgent}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
        ✅ Mounted client-side only — no SSR, no &ldquo;window is not defined&rdquo; error
      </p>
    </div>
  );
}
