"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Weapons", "Armor", "Potions"];
const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A→Z" },
  { value: "name-desc", label: "Name Z→A" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

interface ProductFilterProps {
  /** The current category filter from the URL (default: "All") */
  currentCategory: string;
  /** The current sort value from the URL (default: "name-asc") */
  currentSort: string;
}

/**
 * ProductFilter — Client Component that reads URL params via useSearchParams()
 * and updates them via useRouter().push().
 *
 * Wrapped in <Suspense> in the parent Server Component because useSearchParams()
 * opts the component into client-side rendering during the SSR pass.
 */
export default function ProductFilter({ currentCategory, currentSort }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: "category" | "sort", value: string) => {
    // Build a new URLSearchParams from the current ones
    const params = new URLSearchParams(searchParams.toString());

    if (key === "category" && value === "All") {
      params.delete("category");
    } else {
      params.set(key, value);
    }

    // Default sort — remove from URL to keep it clean
    if (key === "sort" && value === "name-asc") {
      params.delete("sort");
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `/intermediate/search-params?${queryString}`
      : "/intermediate/search-params";

    // Wrap in startTransition so the pending indicator shows
    startTransition(() => {
      router.push(newUrl);
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Filter Products</span>
        </div>
        {isPending && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Updating…</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Category
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
          {CATEGORIES.map((cat) => {
            const isActive = cat === currentCategory;
            return (
              <button
                key={cat}
                id={`filter-category-${cat.toLowerCase()}`}
                onClick={() => updateFilter("category", cat)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <ArrowUpDown className="h-3 w-3" />
          Sort By
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sort order">
          {SORT_OPTIONS.map((opt) => {
            const isActive = opt.value === currentSort;
            return (
              <button
                key={opt.value}
                id={`filter-sort-${opt.value}`}
                onClick={() => updateFilter("sort", opt.value)}
                aria-pressed={isActive}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active URL display */}
      <div className="rounded-lg bg-muted/60 border border-border px-3 py-2 text-[11px] font-mono text-muted-foreground leading-relaxed">
        <span className="text-[10px] font-bold text-foreground block mb-0.5">Current URL params (from useSearchParams)</span>
        <span className="text-primary">?</span>
        {searchParams.toString() || (
          <span className="italic text-muted-foreground/60">(no params — showing all)</span>
        )}
        {searchParams.toString() && (
          <span className="text-foreground">{searchParams.toString()}</span>
        )}
      </div>
    </div>
  );
}
