import React, { Suspense, ViewTransition } from "react";
import Link from "next/link";
import LabExplanation from "@/components/lab-explanation";
import { Camera, Image as ImageIcon, Users, Loader2 } from "lucide-react";

export interface PhotoItem {
  id: string;
  title: string;
  photographer: "Alice" | "Bob";
  bg: string;
  description: string;
  cameraSettings: string;
}

export const photosRegistry: PhotoItem[] = [
  {
    id: "1",
    title: "Midnight Whispers",
    photographer: "Alice",
    bg: "from-purple-600 to-indigo-900",
    description: "A deep violet night sky reflecting over stagnant, misty lake waters in autumn.",
    cameraSettings: "f/2.8 · 15s · ISO 1600 · 24mm"
  },
  {
    id: "2",
    title: "Golden Solitude",
    photographer: "Alice",
    bg: "from-amber-500 to-orange-800",
    description: "Sunlight slicing through dark thunderclouds over a lone desert canyon rock formation.",
    cameraSettings: "f/8 · 1/250s · ISO 100 · 85mm"
  },
  {
    id: "3",
    title: "Emerald Canopies",
    photographer: "Alice",
    bg: "from-emerald-500 to-teal-900",
    description: "Looking upwards from the damp forest floor through giant mossy pine canopies.",
    cameraSettings: "f/4 · 1/60s · ISO 400 · 16mm"
  },
  {
    id: "4",
    title: "Neon Pulse",
    photographer: "Bob",
    bg: "from-pink-500 to-rose-900",
    description: "Cyberpunk urban alleyway illuminated by fluorescent pink and cyan neon store signs.",
    cameraSettings: "f/1.8 · 1/120s · ISO 800 · 50mm"
  },
  {
    id: "5",
    title: "Deep Sea Echoes",
    photographer: "Bob",
    bg: "from-cyan-500 to-blue-900",
    description: "Sunbeams piercing down into the deep blue twilight zone of the open ocean.",
    cameraSettings: "f/2.8 · 1/200s · ISO 200 · 35mm"
  },
  {
    id: "6",
    title: "Frostbite Valley",
    photographer: "Bob",
    bg: "from-sky-300 to-indigo-600",
    description: "Powder-soft snow peaks in alpine ranges casting long violet shadows at sunset.",
    cameraSettings: "f/11 · 1/80s · ISO 100 · 70mm"
  }
];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ photographer?: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Advanced Lab: Motion Gallery (View Transitions)
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice React 19 `<span className="font-mono">ViewTransition</span>` declarations, shared element morphing, and same-route tab crossfading.
        </p>
      </div>

      {/* Lab Explanation */}
      <LabExplanation labSlug="gallery" />

      {/* Suspense Wrapper to extract searchParams without blocking the static shell */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-4 py-20 items-center justify-center text-muted-foreground text-xs font-semibold">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading gallery collections...</span>
          </div>
        }
      >
        {searchParams.then(({ photographer }) => (
          <GalleryContent photographer={photographer} />
        ))}
      </Suspense>
    </div>
  );
}

// Subcomponent rendering after searchParams resolve inside Suspense
async function GalleryContent({ photographer }: { photographer?: string }) {
  const activePhotographer = photographer === "Bob" ? "Bob" : "Alice";
  const filteredPhotos = photosRegistry.filter((p) => p.photographer === activePhotographer);

  return (
    <div className="mt-2 flex flex-col gap-6">
      {/* Photographer Tabs Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Exhibition Galleries</h2>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
          <Link
            href="/advanced/gallery?photographer=Alice"
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activePhotographer === "Alice"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Alice Archer</span>
          </Link>
          <Link
            href="/advanced/gallery?photographer=Bob"
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activePhotographer === "Bob"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Bob Bennett</span>
          </Link>
        </div>
      </div>

      {/* Gallery Crossfade Wrapper */}
      <ViewTransition
        key={activePhotographer}
        name="collection-content"
        share="auto"
        enter="auto"
        default="none"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPhotos.map((photo) => (
            <Link
              key={photo.id}
              href={`/advanced/gallery/photo/${photo.id}`}
              transitionTypes={["nav-forward"]}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Photo Aspect Ratio Block containing gradient backdrop */}
              <ViewTransition name={`photo-${photo.id}`}>
                <div className={`aspect-[4/3] w-full bg-gradient-to-tr ${photo.bg} p-6 flex flex-col justify-end text-white relative`}>
                  <div className="absolute inset-0 bg-black/25 opacity-60 group-hover:opacity-30 transition-opacity" />
                  
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/80 font-bold flex items-center gap-1">
                      <ImageIcon className="h-2.5 w-2.5" />
                      Artwork #{photo.id}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-white line-clamp-1">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </ViewTransition>

              {/* Photo Description details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
                
                <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{photo.cameraSettings}</span>
                  <span className="text-primary font-bold group-hover:underline">View Art &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ViewTransition>
    </div>
  );
}
