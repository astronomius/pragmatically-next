"use client";

import React, { useState } from "react";
import { labsRegistry } from "@/config/labs";
import { BookOpen, ChevronDown, Award, HelpCircle, Code2 } from "lucide-react";

interface LabExplanationProps {
  labSlug: string;
}

export default function LabExplanation({ labSlug }: LabExplanationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const lab = labsRegistry.find((l) => l.slug === labSlug);

  if (!lab) return null;

  return (
    <div className="mb-8 w-full rounded-xl border border-border bg-card shadow-sm transition-all duration-300">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm lg:text-base">
              Lab Details & Core Concepts
            </h3>
            <p className="text-xs text-muted-foreground">
              Technical explanation and APIs practiced in this lab
            </p>
          </div>
        </div>
        <div className="rounded-full border border-border p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Collapsible content body */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[1000px] border-t border-border opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {/* Section 1: Overview */}
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Award className="h-4 w-4 text-indigo-500" />
              <span>What is practiced</span>
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {lab.explanation.what}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {lab.practices.map((practice, idx) => (
                <span
                  key={idx}
                  className="rounded bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground"
                >
                  {practice}
                </span>
              ))}
            </div>
          </div>

          {/* Section 2: APIs Used */}
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Code2 className="h-4 w-4 text-emerald-500" />
              <span>APIs Used</span>
            </h4>
            <ul className="flex flex-col gap-2">
              {lab.explanation.apis.map((api, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <code>{api}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: How it works */}
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span>How it works under the hood</span>
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {lab.explanation.howItWorks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
