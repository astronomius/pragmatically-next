"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LabExplanation from "@/components/lab-explanation";
import {
  Zap,
  Package,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  BarChart3,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Heavy "chart" component loaded lazily.
   The custom loading skeleton is shown while the
   JS chunk is being fetched and evaluated.
───────────────────────────────────────────── */
const DynamicBarChart = dynamic(
  () => import("@/components/lazy-bar-chart"),
  {
    loading: () => (
      <div className="flex flex-col gap-3 animate-pulse p-4">
        <div className="flex items-end gap-2 h-32">
          {[60, 85, 45, 70, 95, 55, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
        <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Loading chart bundle…</span>
        </div>
      </div>
    ),
    ssr: false, // Chart uses window.ResizeObserver — skip SSR
  }
);

/* ─────────────────────────────────────────────
   Browser-only widget that reads window.navigator.
   Setting ssr: false avoids "window is not defined"
   errors during server rendering.
───────────────────────────────────────────── */
const BrowserInfoWidget = dynamic(
  () => import("@/components/browser-info-widget"),
  {
    loading: () => (
      <div className="animate-pulse flex flex-col gap-2 p-4">
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    ),
    ssr: false,
  }
);

export default function LazyLoadingLabPage() {
  const [showChart, setShowChart] = useState(false);
  const [showBrowserInfo, setShowBrowserInfo] = useState(false);
  const [chartLoadCount, setChartLoadCount] = useState(0);

  const handleToggleChart = () => {
    if (!showChart) setChartLoadCount((c) => c + 1);
    setShowChart((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Basic Lab: Dynamic Imports &amp; Lazy Loading
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice splitting JavaScript bundles with <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">next/dynamic</code> to reduce initial load weight, and prevent server rendering of browser-only components.
        </p>
      </div>

      {/* Lab Explanation */}
      <LabExplanation labSlug="lazy" />

      {/* ── Playground Grid ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Play 1: Deferred Chart Component */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Deferred Chart Bundle
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The chart component&apos;s JS chunk is <strong className="text-foreground">not</strong> included in the initial page bundle. It is downloaded only when you toggle it on.
            </p>
          </div>

          {/* Bundle weight indicator */}
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Initial bundle (without chart)</span>
                <span className="font-mono text-emerald-500 font-bold">~12 KB</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>On-demand chart chunk</span>
                <span className="font-mono text-amber-500 font-bold">~38 KB</span>
              </div>
              <div className="mt-1 flex justify-between text-muted-foreground">
                <span>Times chart chunk loaded</span>
                <span className="font-mono text-primary font-bold">{chartLoadCount}×</span>
              </div>
            </div>
          </div>

          {/* Toggle + render area */}
          <button
            id="toggle-chart-btn"
            onClick={handleToggleChart}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${showChart
              ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
              : "border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
          >
            {showChart ? (
              <><EyeOff className="h-4 w-4" /> Hide Chart</>
            ) : (
              <><Eye className="h-4 w-4" /> Load Chart</>
            )}
          </button>

          {/* Chart mount area */}
          <div
            className={`rounded-lg border border-border bg-background overflow-hidden transition-all duration-300 ${showChart ? "min-h-[160px]" : "min-h-0 max-h-0 border-transparent"
              }`}
          >
            {showChart && <DynamicBarChart />}
          </div>

          {/* Code snippet */}
          <div className="rounded-lg bg-muted/60 border border-border p-3 text-[11px] font-mono text-muted-foreground leading-relaxed">
            <span className="text-indigo-400">const</span>{" "}
            <span className="text-foreground">DynamicBarChart</span>{" "}
            <span className="text-muted-foreground">= </span>
            <span className="text-indigo-400">dynamic</span>
            {"(\n  () => "}
            <span className="text-emerald-400">import</span>
            {"(\"@/components/lazy-bar-chart\"),\n  "}
            {"{ loading: () => <Skeleton />, ssr: "}
            <span className="text-amber-400">false</span>
            {" }\n)"}
          </div>
        </div>

        {/* Play 2: SSR=false Browser-Only Widget */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Monitor className="h-5 w-5 text-emerald-500" />
              Browser-Only Component (<code className="text-[13px]">ssr: false</code>)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Components that access <code className="bg-muted px-1 rounded text-[10px]">window</code> or <code className="bg-muted px-1 rounded text-[10px]">navigator</code> throw errors during SSR. Setting <code className="bg-muted px-1 rounded text-[10px]">ssr: false</code> skips the server render entirely.
            </p>
          </div>

          {/* SSR comparison */}
          <div className="flex flex-col gap-2">
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 flex items-start gap-2 text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-muted-foreground">
                <span className="font-semibold text-red-500">Without ssr: false</span> — Node.js throws{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-[10px]">ReferenceError: window is not defined</code>{" "}
                during the server render pass.
              </div>
            </div>
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 flex items-start gap-2 text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-muted-foreground">
                <span className="font-semibold text-emerald-500">With ssr: false</span> — Next.js excludes this component from the server render. It mounts only after the browser environment is ready.
              </div>
            </div>
          </div>

          <button
            id="toggle-browser-info-btn"
            onClick={() => setShowBrowserInfo((prev) => !prev)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${showBrowserInfo
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15"
              : "border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
          >
            {showBrowserInfo ? (
              <><EyeOff className="h-4 w-4" /> Hide Widget</>
            ) : (
              <><Eye className="h-4 w-4" /> Mount Browser Widget</>
            )}
          </button>

          <div
            className={`rounded-lg border border-border bg-background overflow-hidden transition-all duration-300 ${showBrowserInfo ? "min-h-[80px]" : "min-h-0 max-h-0 border-transparent"
              }`}
          >
            {showBrowserInfo && <BrowserInfoWidget />}
          </div>
        </div>
      </div>

      {/* ── Concept Summary ── */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-amber-500" />
          When to Use Each Strategy
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">dynamic() — Default</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use for large interactive components (rich text editors, chart libraries, map widgets) that aren&apos;t needed on first paint. They still SSR, so initial HTML is correct.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">dynamic() + ssr: false</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use for components that read <code className="bg-muted px-1 rounded text-[10px]">window</code>, <code className="bg-muted px-1 rounded text-[10px]">navigator</code>, or other browser globals. They are completely excluded from the server render.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Static import — Always</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use for critical above-the-fold components. They are always in the initial bundle and render immediately without any dynamic loading overhead.
            </p>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-foreground">Why this matters:</span>{" "}
          Every kilobyte in the initial JS bundle delays Time to Interactive (TTI). Lazy loading heavy components like rich text editors, charts, or maps can reduce initial bundle size by 30–70%, dramatically improving Core Web Vitals scores and perceived performance on slower networks.
        </div>
      </div>

      {/* Practice hint */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs leading-relaxed">
        <Zap className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-muted-foreground">
          <span className="font-semibold text-amber-500">Try it:</span>{" "}
          Open Chrome DevTools → Network tab → filter by <strong>JS</strong>. Click &ldquo;Load Chart&rdquo; and watch a new chunk request fire. Notice it doesn&apos;t download again on second mount — the browser caches the chunk.
        </div>
      </div>
    </div>
  );
}
