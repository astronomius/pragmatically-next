import React, { Suspense } from "react";
import Link from "next/link";
import LabExplanation from "@/components/lab-explanation";
import ProductFilter from "@/components/product-filter";
import { getProducts, Product } from "@/lib/db";
import {
  ShoppingBag,
  Tag,
  ArrowRight,
  Info,
  Server,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Sorting / filtering helpers — run on the server
   because this is an async Server Component.
───────────────────────────────────────────── */
function filterProducts(
  products: Product[],
  category: string,
  sort: string
): Product[] {
  let result = products;

  // Filter by category
  if (category && category !== "All") {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Sort
  switch (sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "name-desc":
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
      break;
    default: // name-asc
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

const CATEGORY_COLORS: Record<string, string> = {
  Weapons: "bg-red-500/10 text-red-500 border-red-500/20",
  Armor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Potions: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

/* ─────────────────────────────────────────────
   Loading skeleton for <Suspense> around filter
───────────────────────────────────────────── */
function FilterSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-muted rounded-full w-16" />
        ))}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-muted rounded-lg w-20" />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page — Async Server Component
   Receives searchParams as a prop automatically.
───────────────────────────────────────────── */
export default async function SearchParamsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  // In Next.js 16, searchParams is a Promise — must be awaited
  const params = await searchParams;
  const category = params.category ?? "All";
  const sort = params.sort ?? "name-asc";

  // All filtering/sorting runs on the server — no client state needed
  const allProducts = await getProducts();
  const filteredProducts = filterProducts(allProducts, category, sort);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intermediate Lab: Search Params &amp; URL State
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice reading <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">searchParams</code> in Server Components for server-side filtering, and <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">useSearchParams()</code> on the client for reactive URL state.
        </p>
      </div>

      {/* Lab Explanation */}
      <LabExplanation labSlug="search-params" />

      {/* Server-side context banner */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex gap-3 text-xs">
        <Server className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
        <div className="text-muted-foreground leading-relaxed">
          <span className="font-semibold text-indigo-400 block mb-1">
            Server Component Render — Current searchParams
          </span>
          <div className="font-mono flex flex-wrap gap-2">
            <span className="bg-muted rounded px-2 py-0.5">
              category: <span className="text-foreground">{JSON.stringify(category)}</span>
            </span>
            <span className="bg-muted rounded px-2 py-0.5">
              sort: <span className="text-foreground">{JSON.stringify(sort)}</span>
            </span>
            <span className="bg-muted rounded px-2 py-0.5">
              results: <span className="text-primary">{filteredProducts.length}</span> / {allProducts.length} products
            </span>
          </div>
          <p className="mt-2 text-[11px]">
            These values come directly from the URL — the server reads <code className="bg-muted px-1 rounded">searchParams</code> prop and executes the filter/sort before sending any HTML to the browser.
          </p>
        </div>
      </div>

      {/* ── Main Layout: Filter sidebar + Product Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Client Filter Panel — wrapped in Suspense because useSearchParams() */}
        <Suspense fallback={<FilterSkeleton />}>
          <ProductFilter currentCategory={category} currentSort={sort} />
        </Suspense>

        {/* Product Grid — server rendered with filtered data */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              {filteredProducts.length === 0
                ? "No products found"
                : `${filteredProducts.length} Product${filteredProducts.length !== 1 ? "s" : ""}`}
              {category !== "All" && (
                <span className="text-muted-foreground font-normal">
                  in <em>{category}</em>
                </span>
              )}
            </h2>
            <Link
              href="/intermediate/search-params"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              Clear filters →
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No products match the current filter.
              </p>
              <Link
                href="/intermediate/search-params"
                className="text-xs text-primary font-semibold hover:underline"
              >
                Show all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.slug}
                  className="group relative rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col gap-3"
                >
                  {/* Category badge */}
                  <span
                    className={`inline-flex items-center gap-1 self-start rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      CATEGORY_COLORS[product.category] ??
                      "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {product.category}
                  </span>

                  {/* Name and price */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="shrink-0 text-sm font-extrabold text-primary">
                      ${product.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* View in Shop link */}
                  <Link
                    href={`/advanced/shop/${product.slug}`}
                    className="mt-auto flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    View in Shop <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Concept explainer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-500" />
            Server Component: <code className="text-[12px]">searchParams</code> prop
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Async Server Components receive <code className="bg-muted px-1 rounded text-[10px]">searchParams</code> as a <strong>Promise</strong> in Next.js 16. After awaiting it, the values are available for server-side filtering — no <code className="bg-muted px-1 rounded text-[10px]">useState</code>, no <code className="bg-muted px-1 rounded text-[10px]">useEffect</code>.
          </p>
          <div className="rounded-lg bg-muted/60 border border-border p-3 text-[11px] font-mono text-muted-foreground">
            <span className="text-indigo-400">const</span>{" params = "}
            <span className="text-amber-400">await</span>{" searchParams"}<br />
            <span className="text-indigo-400">const</span>{" filtered = filterProducts(products, params.category)"}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-emerald-500" />
            Client Component: <code className="text-[12px]">useSearchParams()</code>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <code className="bg-muted px-1 rounded text-[10px]">useSearchParams()</code> reactively reflects the URL. Combined with <code className="bg-muted px-1 rounded text-[10px]">useRouter().push()</code>, clicking a filter tab updates the URL, triggering the Server Component to re-render with the new params.
          </p>
          <div className="rounded-lg bg-muted/60 border border-border p-3 text-[11px] font-mono text-muted-foreground">
            <span className="text-indigo-400">const</span>{" searchParams = "}<span className="text-emerald-400">useSearchParams()</span><br />
            {"router.push(`/path?"}
            <span className="text-amber-400">{"${params}"}</span>
            {"`)"}
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-foreground">Why this matters:</span>{" "}
          URL-driven state is shareable, bookmarkable, and works without JavaScript. Search engines index every filtered view. When you combine server <code className="bg-muted px-1 rounded">searchParams</code> with client <code className="bg-muted px-1 rounded">useSearchParams()</code>, you get the best of both worlds — server-rendered accuracy and instant client-side reactivity.
        </div>
      </div>
    </div>
  );
}
