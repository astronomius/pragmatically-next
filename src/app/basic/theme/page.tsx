"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import LabExplanation from "@/components/lab-explanation";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Clock, 
  Layers, 
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function ThemeLabPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  
  // Accordion persistence state
  const STORAGE_KEY = "pragmatic-accordion-open";
  const [isOpenSection, setIsOpenSection] = useState<string>("features");

  // Client-only mount detection
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);

    // Sync accordion state on mount to prevent hydration mismatch
    const savedAccordion = localStorage.getItem(STORAGE_KEY);
    if (savedAccordion) {
      setTimeout(() => {
        setIsOpenSection(savedAccordion);
      }, 0);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAccordion = (sectionId: string) => {
    setIsOpenSection(sectionId);
    try {
      localStorage.setItem(STORAGE_KEY, sectionId);
    } catch (e) {
      console.error(e);
    }
  };

  // Hydration testing timestamps
  const staticServerTime = "2026-06-11T12:00:00.000Z";

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Basic Lab: Theme Switcher & Hydration Sync
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice preventing hydration flashes, handling client-side persistent UI, and syncing document styles before browser paint.
        </p>
      </div>

      {/* Collapsible Tech Explanation */}
      <LabExplanation labSlug="theme" />

      {/* Interactive Playgrounds Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Play 1: Interactive Theme Switcher Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sun className="h-5 w-5 text-indigo-500" />
              Theme Controller
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select your theme interface. The inline header script parses localStorage before body paints, stopping the white flash.
            </p>

            {/* Current Active Indicator */}
            <div className="mt-4 rounded-lg bg-muted p-4 flex items-center justify-between border border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Configuration</span>
              <span className="text-sm font-bold capitalize flex items-center gap-1.5 text-primary">
                {theme === "light" && <Sun className="h-4 w-4" />}
                {theme === "dark" && <Moon className="h-4 w-4" />}
                {theme === "system" && <Monitor className="h-4 w-4" />}
                {theme} Mode
              </span>
            </div>
          </div>

          {/* Switch Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-xs font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-xs font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span className="text-xs font-medium">System</span>
            </button>
          </div>
        </div>

        {/* Play 2: Hydration Flash/Mismatch prevention */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" />
              Client Date Hydration Sync
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Dates parsed on the server differ from browser locales, throwing hydration mismatches. Compare how client state renders safely.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {/* Raw Hydration Warning demo */}
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Server-Generated Timestamp (Static)</span>
                </div>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  Date representation on Node server: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{staticServerTime}</code>.
                </p>
              </div>

              {/* Dynamic Hydration-safe element */}
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Hydration-Safe Client Local Timestamp</span>
                </div>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  Calculated dynamically after client mount:{" "}
                  <strong className="text-foreground">
                    {mounted ? new Date(staticServerTime).toLocaleString() : "Loading locale..."}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Clock Ticker */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground font-medium">Live Clock (State updates):</span>
            <span className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded border border-border flex items-center gap-1.5 text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {mounted ? currentTime : "Syncing..."}
            </span>
          </div>
        </div>
      </div>

      {/* Play 3: Persistent Accordion Layout */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="h-5 w-5 text-amber-500" />
          Persistent Collapsible Accordion (No Hydration Mismatch)
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Using a client-side lazy state initializer matching local storage value to prevent the DOM from reloading, shaking or flashing open elements.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {/* Section 1: Features */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <button
              onClick={() => handleToggleAccordion("features")}
              className="flex w-full items-center justify-between p-4 text-left font-medium text-sm text-foreground hover:bg-muted/50"
            >
              <span>1. Dynamic Themes Features</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isOpenSection === "features" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {isOpenSection === "features" ? "Expanded" : "Closed"}
              </span>
            </button>
            {isOpenSection === "features" && (
              <div className="p-4 border-t border-border text-xs leading-relaxed text-muted-foreground">
                Our theme switcher writes preferences immediately to cookies or LocalStorage. Custom CSS properties inside the `:root` and `html[data-theme=&apos;dark&apos;]` classes handle CSS class alterations instantly, keeping components styled dynamically.
              </div>
            )}
          </div>

          {/* Section 2: Hydration Error */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <button
              onClick={() => handleToggleAccordion("hydration")}
              className="flex w-full items-center justify-between p-4 text-left font-medium text-sm text-foreground hover:bg-muted/50"
            >
              <span>2. Why standard useEffect state causes layout shifts</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isOpenSection === "hydration" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {isOpenSection === "hydration" ? "Expanded" : "Closed"}
              </span>
            </button>
            {isOpenSection === "hydration" && (
              <div className="p-4 border-t border-border text-xs leading-relaxed text-muted-foreground">
                If the server renders a closed accordion, but a client-side effect updates it to open *after* the browser page paints, the user suffers a noticeable layout shift. A lazy state initializer `useState(() =&gt; localStorage.getItem(&apos;key&apos;) || default)` guarantees that React matches the saved client settings from the very first frame.
              </div>
            )}
          </div>

          {/* Section 3: Performance */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <button
              onClick={() => handleToggleAccordion("performance")}
              className="flex w-full items-center justify-between p-4 text-left font-medium text-sm text-foreground hover:bg-muted/50"
            >
              <span>3. CSS Variable Styling Advantage</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isOpenSection === "performance" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {isOpenSection === "performance" ? "Expanded" : "Closed"}
              </span>
            </button>
            {isOpenSection === "performance" && (
              <div className="p-4 border-t border-border text-xs leading-relaxed text-muted-foreground">
                Using variables like `var(--background)` inside Tailwind classes ensures that toggle animations don&apos;t require expensive script-driven class toggles on every single div. The stylesheet recalculates variables in a single paint operation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
