"use client";

import React, { createContext, use, useState, Suspense } from "react";
import LabExplanation from "@/components/lab-explanation";
import { 
  Settings2, 
  HelpCircle, 
  Loader2, 
  ToggleLeft, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// Mock configuration profile type
interface ConfigSettings {
  environment: "development" | "staging" | "production";
  debugMode: boolean;
  rateLimit: number;
  apiEndpoint: string;
}

// 1. Context definition for Feature Flags
interface FeatureFlags {
  enableBetaActions: boolean;
  enableTelemetrySync: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlags>({
  enableBetaActions: false,
  enableTelemetrySync: false,
});

// Mock async settings fetcher that simulates server delay
const fetchSettingsPromise = (): Promise<ConfigSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        environment: "production",
        debugMode: true,
        rateLimit: 120,
        apiEndpoint: "https://api.nextjs-labs.internal/v1",
      });
    }, 1200); // 1.2-second lookup delay
  });
};

// Start the promise early in-module (or pass down from a Server page)
const globalSettingsPromise = fetchSettingsPromise();

export default function UseHookLabPage() {
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);
  const [betaEnabled, setBetaEnabled] = useState(false);

  // Context value object
  const flagsValue: FeatureFlags = {
    enableBetaActions: betaEnabled,
    enableTelemetrySync: true,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Advanced Lab: use() Hook Configuration
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice React 19&apos;s new `use()` API, resolve dynamic asynchronous Promises in-render, and consume Context conditionally.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="use-hook" />

      {/* Flag Provider Context wrap */}
      <FeatureFlagsContext.Provider value={flagsValue}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Controls Panel */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Context Flags Controller
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Toggling flags updates React Context state. The specifications panel consumes this Context values conditionally inside an `if` statement using the `use()` API.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {/* Checkbox 1: Enable specs */}
                <label className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">Inspect Technical Details</span>
                    <span className="text-[10px] text-muted-foreground">Enables rendering path for use(Context)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showTechnicalSpecs}
                    onChange={(e) => setShowTechnicalSpecs(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                </label>

                {/* Checkbox 2: Enable beta */}
                <label className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">Activate Beta Actions Flag</span>
                    <span className="text-[10px] text-muted-foreground">Updates context value parameter</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={betaEnabled}
                    onChange={(e) => setBetaEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                </label>
              </div>
            </div>

            <div className="mt-8 border-t border-border/80 pt-4 text-[10px] text-muted-foreground font-mono flex items-center gap-2">
              <ToggleLeft className="h-4 w-4 text-primary" />
              <span>Provider status: Active & Syncing Context</span>
            </div>
          </div>

          {/* Specs / Display Panel */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Live Configuration Specs
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Asynchronous database configuration values are loaded below using a mock delayed promise, streamed dynamically behind Suspense.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {/* Suspense wrapper for promise resolution */}
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-2 py-8 items-center justify-center text-muted-foreground text-[11px] border border-dashed border-border/80 rounded-lg bg-muted/30">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Resolving config promise in-render...</span>
                    </div>
                  }
                >
                  <ConfigDisplayPanel 
                    promise={globalSettingsPromise} 
                    showSpecs={showTechnicalSpecs}
                  />
                </Suspense>
              </div>
            </div>

            <div className="mt-8 border-t border-border/80 pt-4 text-[10px] text-zinc-500 font-mono">
              <span>Resolves with React 19 &lt;Suspense&gt; hook integration</span>
            </div>
          </div>

        </div>
      </FeatureFlagsContext.Provider>
    </div>
  );
}

// Subcomponent resolving config details using use(Promise) and use(Context)
interface DisplayProps {
  promise: Promise<ConfigSettings>;
  showSpecs: boolean;
}

function ConfigDisplayPanel({ promise, showSpecs }: DisplayProps) {
  // 2. Resolve Async settings Promise dynamically during render!
  const settings = use(promise);

  return (
    <div className="flex flex-col gap-4">
      {/* Details list resolved from promise */}
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="h-4 w-4" />
          Promise Resolved!
        </h3>
        
        <div className="grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground">
          <div>
            <strong className="text-foreground">Environment:</strong> {settings.environment}
          </div>
          <div>
            <strong className="text-foreground">Rate Limit:</strong> {settings.rateLimit}/min
          </div>
          <div className="col-span-2">
            <strong className="text-foreground">API Endpoints:</strong> <code className="bg-muted px-1 rounded font-mono text-[10px]">{settings.apiEndpoint}</code>
          </div>
        </div>
      </div>

      {/* Conditional Context rendering */}
      {/* 3. Consume Context value conditionally using use() inside a logic branch! */}
      <div className="rounded-lg border border-border p-4 bg-muted/20">
        <h4 className="text-xs font-bold text-foreground mb-1">Conditional Context Box</h4>
        {showSpecs ? (
          <ContextSpecsRenderer />
        ) : (
          <p className="text-[10px] text-muted-foreground leading-normal flex items-start gap-1.5 mt-2">
            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>Check &quot;Inspect Technical Details&quot; to dynamically run use(Context) rendering block.</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Sub-subcomponent rendering the context values
function ContextSpecsRenderer() {
  // This hook is executed inside a nested render block dynamically, 
  // which is allowed in React 19 with the use() API.
  const flags = use(FeatureFlagsContext);

  return (
    <div className="mt-2 text-[11px] text-muted-foreground flex flex-col gap-1.5 border-t border-border/80 pt-2 font-mono">
      <div className="flex items-center justify-between">
        <span>context.enableBetaActions:</span>
        <span className={`font-bold ${flags.enableBetaActions ? "text-primary" : "text-zinc-500"}`}>
          {flags.enableBetaActions ? "TRUE" : "FALSE"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>context.enableTelemetrySync:</span>
        <span className="font-bold text-emerald-500">
          {flags.enableTelemetrySync ? "TRUE" : "FALSE"}
        </span>
      </div>
    </div>
  );
}
