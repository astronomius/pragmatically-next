"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LabExplanation from "@/components/lab-explanation";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Gauge, 
  Layers, 
  Maximize, 
  Info
} from "lucide-react";

export default function ImageLabPage() {
  const [activeTab, setActiveTab] = useState<"comparison" | "telemetry">("comparison");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  // Heavy space image from Unsplash
  const imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa";

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Basic Lab: LCP Image Optimization
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice Core Web Vitals optimizations, prevent Cumulative Layout Shifts (CLS), and utilize Next.js automatic image conversions.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="image" />

      {/* Tabs Selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "comparison"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Visual Comparison
        </button>
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "telemetry"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Performance Telemetry
        </button>
      </div>

      {activeTab === "comparison" ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Standard Unoptimized Image */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-4 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    Standard &lt;img&gt; tag
                  </span>
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">
                    Unoptimized
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
                  Loads raw heavy resource, lacks fallback blur placeholders, and causes visual shifts during load if width/height are absent.
                </p>
              </div>

              {/* Render standard image with heavy Unsplash param */}
              <div className="bg-black/5 flex-1 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                {mounted && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`${imageUrl}?q=80&w=3000`}
                    alt="Space unoptimized"
                    className="w-full h-full object-cover max-h-[350px]"
                  />
                )}
              </div>

              <div className="p-4 bg-muted/10 border-t border-border text-[11px] text-muted-foreground flex justify-between items-center">
                <span>Format: Original JPEG</span>
                <span className="font-semibold text-red-500">Payload: ~2.4 MB</span>
              </div>
            </div>

            {/* Next.js Optimized Image */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-4 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Next.js &lt;Image&gt; Component
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                    LCP Optimized
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
                  Converts to WebP/AVIF, resizes dynamically based on sizes, utilizes priority preloading, and prevents layout reflows.
                </p>
              </div>

              {/* Render optimized Next.js image */}
              <div className="bg-black/5 flex-1 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Space optimized"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover max-h-[350px]"
                />
              </div>

              <div className="p-4 bg-muted/10 border-t border-border text-[11px] text-muted-foreground flex justify-between items-center">
                <span>Format: WebP / AVIF (Auto)</span>
                <span className="font-semibold text-emerald-500">Payload: ~48 KB (Optimized)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Telemetry dashboard showing web vitals specs */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* LCP metric */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Gauge className="h-4.5 w-4.5 text-primary" />
              Largest Contentful Paint (LCP)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              LCP measures when the main page content has likely loaded. Adding the <code className="bg-muted px-1 py-0.5 rounded">priority</code> and <code className="bg-muted px-1 py-0.5 rounded">fetchpriority=&quot;high&quot;</code> tags to above-the-fold images instructs browser pre-parsers to prioritize this request, lowering rendering start delays by up to <strong>60%</strong>.
            </p>
            <div className="mt-2 bg-muted/50 rounded-lg p-3 text-center border border-border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">LCP Render Time</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">~380ms <span className="text-xs text-muted-foreground">(vs ~1200ms)</span></div>
            </div>
          </div>

          {/* CLS metric */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-amber-500" />
              Cumulative Layout Shift (CLS)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CLS evaluates visual stability. Raw images without explicit sizes pop and reflow the layout when loading. The Next.js compiler enforces predefined aspect ratios or layout settings (e.g. <code className="bg-muted px-1 py-0.5 rounded">fill</code>) to preallocate space, locking CLS to a perfect score.
            </p>
            <div className="mt-2 bg-muted/50 rounded-lg p-3 text-center border border-border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">CLS Shift Score</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">0.00 <span className="text-xs text-muted-foreground">(Perfect)</span></div>
            </div>
          </div>

          {/* Weight metric */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Maximize className="h-4.5 w-4.5 text-indigo-500" />
              Responsive Format Conversion
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Next.js server-side image processors analyze incoming client headers. If WebP or AVIF formats are supported, the server transcodes the image on the fly, delivering lightweight payloads. The generated <code className="bg-muted px-1 py-0.5 rounded">srcset</code> ensures mobile devices download appropriately sized frames.
            </p>
            <div className="mt-2 bg-muted/50 rounded-lg p-3 text-center border border-border">
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Bandwidth Saving</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">98.2% <span className="text-xs text-muted-foreground">Reduction</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Summary note box */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-foreground">Why this matters:</span> Large unoptimized images are the single most common cause of slow web pages. By configuring Next.js responsive image boundaries, you guarantee that users on mobile networks load lightweight assets instantly, dramatically raising conversion and SEO rankings.
        </div>
      </div>
    </div>
  );
}
