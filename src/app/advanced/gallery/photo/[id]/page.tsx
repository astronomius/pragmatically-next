import React, { Suspense, ViewTransition } from "react";
import Link from "next/link";
import { photosRegistry } from "../../page";
import { ArrowLeft, Camera, ShieldAlert, Heart, Share2, ZoomIn, Loader2 } from "lucide-react";

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4 py-20 items-center justify-center text-muted-foreground text-xs font-semibold">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading exhibition frame...</span>
        </div>
      }
    >
      {params.then(({ id }) => (
        <PhotoDetailContent id={id} />
      ))}
    </Suspense>
  );
}

// Subcomponent that runs inside Suspense after params resolve
async function PhotoDetailContent({ id }: { id: string }) {
  const photo = photosRegistry.find((p) => p.id === id);

  if (!photo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-foreground">Artwork Not Found</h2>
        <Link href="/advanced/gallery" className="mt-4 text-xs font-semibold text-primary underline">
          Return to Exhibition
        </Link>
      </div>
    );
  }

  return (
    // Wrap page content in directional transition anims
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <div className="flex flex-col gap-6">
        {/* Back Link with navigation type back indicator */}
        <div>
          <Link
            href={`/advanced/gallery?photographer=${photo.photographer}`}
            transitionTypes={["nav-back"]}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exhibition Gallery
          </Link>
        </div>

        {/* Hero Morph Exhibition Wrapper */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Morphing element - matching name attribute */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border">
            <ViewTransition name={`photo-${photo.id}`}>
              <div className={`aspect-[4/3] w-full bg-gradient-to-tr ${photo.bg} p-8 flex flex-col justify-between text-white relative`}>
                <div className="absolute inset-0 bg-black/15" />
                
                {/* Visual interface details */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">
                    Exhibit Frame #{photo.id}
                  </span>
                  <button className="bg-black/40 backdrop-blur-md p-1.5 rounded-full hover:bg-black/60 transition-colors">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
                    {photo.title}
                  </h2>
                  <p className="text-xs text-white/80 font-medium">Captured by {photo.photographer}</p>
                </div>
              </div>
            </ViewTransition>
          </div>

          {/* Description & Technical Metadata card */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Photographer Exhibition Notes</span>
                <h3 className="mt-1 text-xl font-bold text-foreground">{photo.title}</h3>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {photo.description}
              </p>

              <div className="mt-4 rounded-lg bg-muted border border-border p-4 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-primary" />
                  Technical Exif Data
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-muted-foreground font-mono">
                  <div>
                    <span className="font-semibold text-foreground">Aperture:</span> f/2.8 - f/11
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Exposure:</span> Dynamic
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Settings:</span> {photo.cameraSettings}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Lens:</span> Prime Wide/Normal
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border/80 pt-4 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-xs font-semibold hover:bg-muted text-foreground transition-colors">
                <Heart className="h-4 w-4 text-red-500" />
                Like Artwork
              </button>
              <button className="flex flex-none items-center justify-center rounded-lg border border-border p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
