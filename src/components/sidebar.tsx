"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { labsRegistry, LabItem } from "@/config/labs";
import { 
  Sun, 
  Moon, 
  Monitor, 
  BookOpen, 
  FlaskConical, 
  Code,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";
import React, { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Group labs by chapter
  const basicLabs = labsRegistry.filter((lab) => lab.chapter === "Basic");
  const intermediateLabs = labsRegistry.filter((lab) => lab.chapter === "Intermediate");
  const advancedLabs = labsRegistry.filter((lab) => lab.chapter === "Advanced");

  const NavLink = ({ lab }: { lab: LabItem }) => {
    const isActive = pathname === lab.path || pathname.startsWith(lab.path + "/");
    return (
      <Link
        href={lab.path}
        onClick={() => setIsOpen(false)}
        className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span className="truncate">{lab.title}</span>
        <ChevronRight 
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          }`} 
        />
      </Link>
    );
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between border-r border-border bg-card/60 backdrop-blur-md p-6">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div>
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Pragmatic Labs
            </span>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Next.js & React 19 Playground</p>
        </div>

        {/* Navigation Chapters */}
        <nav className="flex flex-col gap-6">
          {/* Basic Chapter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <Code className="h-3.5 w-3.5" />
              <span>Basic</span>
            </div>
            <div className="flex flex-col gap-1">
              {basicLabs.map((lab) => (
                <NavLink key={lab.id} lab={lab} />
              ))}
            </div>
          </div>

          {/* Intermediate Chapter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <Layers className="h-3.5 w-3.5" />
              <span>Intermediate</span>
            </div>
            <div className="flex flex-col gap-1">
              {intermediateLabs.map((lab) => (
                <NavLink key={lab.id} lab={lab} />
              ))}
            </div>
          </div>

          {/* Advanced Chapter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Advanced</span>
            </div>
            <div className="flex flex-col gap-1">
              {advancedLabs.map((lab) => (
                <NavLink key={lab.id} lab={lab} />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Theme Toggler at bottom */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center justify-between rounded-full bg-muted p-1">
          <button
            onClick={() => setTheme("light")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
              theme === "light" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Light Theme"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
              theme === "dark" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Dark Theme"
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
              theme === "system" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="System Theme"
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar overlay toggler */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-6">
        <Link href="/" className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            Next JS Pragmatic Labs
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-border p-1.5 text-foreground hover:bg-muted"
        >
          <span className="sr-only">Toggle Menu</span>
          <BookOpen className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-72 h-full max-w-xs flex-1">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col z-30">
        {renderSidebarContent()}
      </div>
    </>
  );
}
