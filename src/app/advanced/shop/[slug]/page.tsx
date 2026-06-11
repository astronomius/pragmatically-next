export const unstable_instant = {
  prefetch: "runtime",
  samples: [
    { params: { slug: "sword-of-light" } }
  ]
};

import { Suspense } from "react";
import Link from "next/link";
import { getProductBySlug, getProductInventory } from "@/lib/db";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Warehouse, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Shield,
  Coins
} from "lucide-react";

// Server Component (details page entry point)
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Back to storefront link */}
      <div>
        <Link
          href="/advanced/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Armory Store
        </Link>
      </div>

      {/* Main product card wrapper */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left/Middle cols: Details Shell (Cached) */}
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 lg:p-8 shadow-sm flex flex-col justify-between">
          <Suspense 
            fallback={
              <div className="flex flex-col gap-4 py-8 items-center justify-center text-muted-foreground text-xs font-semibold">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Loading product description...</span>
              </div>
            }
          >
            {params.then(({ slug }) => (
              <ProductDetails slug={slug} />
            ))}
          </Suspense>
        </div>

        {/* Right col: Stock & Purchasing Info (Streaming) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Warehouse className="h-4.5 w-4.5 text-primary" />
              Warehouse Stock Status
            </h3>

            {/* Slow inventory streaming element */}
            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="flex flex-col gap-2 py-4 items-center justify-center text-muted-foreground text-[11px] font-medium border border-dashed border-border/85 rounded-lg bg-muted/30">
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                    <span>Querying stock levels...</span>
                  </div>
                }
              >
                <LiveInventory params={params} />
              </Suspense>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-4">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              <ShoppingBag className="h-4 w-4" />
              Purchase Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cached product details retriever
async function ProductDetails({ slug }: { slug: string }) {
  "use cache";
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-8 text-center text-red-500 font-semibold text-sm">
        Product not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {product.name}
        </h1>
        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold border border-primary/20">
          {product.category}
        </span>
      </div>

      <div className="flex items-center gap-1 text-2xl font-extrabold text-foreground border-b border-border/60 pb-4">
        <Coins className="h-5.5 w-5.5 text-amber-500" />
        <span>${product.price}</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Rarity & Spec details */}
      <div className="grid grid-cols-2 gap-4 mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-foreground">Condition:</span> Mint
        </div>
        <div>
          <span className="font-semibold text-foreground">Origin:</span> Prime Dungeon
        </div>
      </div>
    </div>
  );
}

// Uncached live inventory checker (Slow)
async function LiveInventory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const count = await getProductInventory(slug);

  const inStock = count > 0;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-lg border p-4 flex items-center gap-3 ${
          inStock
            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
            : "border-red-500/20 bg-red-500/5 text-red-500"
        }`}
      >
        {inStock ? <CheckCircle className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
        <div>
          <h4 className="text-xs font-bold leading-none">
            {inStock ? "Item Available" : "Out of Stock"}
          </h4>
          <p className="mt-1 text-[10px] text-muted-foreground leading-tight">
            {inStock 
              ? `${count} units ready in regional warehouse.` 
              : "Sold out. Next shipment expected in 3 days."}
          </p>
        </div>
      </div>

      {inStock && (
        <div className="rounded-lg border border-border bg-background p-3 flex gap-2.5 text-[10px] text-muted-foreground">
          <Shield className="h-4 w-4 shrink-0 text-primary" />
          <p className="leading-normal">
            This item is backed by our dungeon-master safety guarantee. Instant item transfers.
          </p>
        </div>
      )}
    </div>
  );
}
