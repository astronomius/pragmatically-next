import React from "react";
import Link from "next/link";
import { getProducts, Product } from "@/lib/db";
import LabExplanation from "@/components/lab-explanation";
import { 
  ShoppingBag, 
  ChevronRight, 
  Tag
} from "lucide-react";

// Cached server function
async function getCachedProducts(): Promise<Product[]> {
  "use cache";
  return await getProducts();
}

export default async function ShopPage() {
  const products = await getCachedProducts();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Advanced Lab: Instant Shop (PPR & Caching)
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice Partial Prerendering (PPR), Next.js 16 static `&apos;use cache&apos;`, and instant routing validations using Suspense boundaries.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="instant-shop" />

      {/* Product Grid section */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Dungeon Armory Store</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/advanced/shop/${product.slug}`}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded bg-muted border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </span>
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                </div>
                
                <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {product.name}
                </h3>
                
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-primary">
                <span>Configure & Purchase</span>
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
