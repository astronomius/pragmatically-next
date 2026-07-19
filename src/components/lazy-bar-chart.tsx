"use client";

import React, { useEffect, useRef } from "react";

const BARS = [
  { label: "Mon", value: 72 },
  { label: "Tue", value: 88 },
  { label: "Wed", value: 55 },
  { label: "Thu", value: 94 },
  { label: "Fri", value: 61 },
  { label: "Sat", value: 78 },
  { label: "Sun", value: 83 },
];

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f97316",
];

/**
 * LazyBarChart — a client component that uses the ResizeObserver API.
 * Intentionally "heavy" to simulate a chart library chunk.
 * Loaded lazily via next/dynamic in the lab page.
 */
export default function LazyBarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...BARS.map((b) => b.value));

  useEffect(() => {
    // Simulate a resize observer (browser-only API) to demonstrate
    // that this component only runs in the client environment.
    const ro = new ResizeObserver(() => {
      // No-op — just proving ResizeObserver is available
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="p-4 flex flex-col gap-3">
      {/* Chart title */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
          Weekly Activity
        </span>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
          lazy-bar-chart.tsx chunk
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 h-28">
        {BARS.map((bar, i) => {
          const heightPct = (bar.value / maxValue) * 100;
          return (
            <div key={bar.label} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-[9px] font-mono text-muted-foreground">
                {bar.value}
              </span>
              <div
                className="w-full rounded-t transition-all duration-700"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                  opacity: 0.85,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-2">
        {BARS.map((bar) => (
          <div key={bar.label} className="flex-1 text-center text-[9px] text-muted-foreground font-medium">
            {bar.label}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        ✅ Chart JS chunk downloaded — ResizeObserver active
      </p>
    </div>
  );
}
