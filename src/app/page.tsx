import React from "react";
import Link from "next/link";
import { labsRegistry, LabItem } from "@/config/labs";
import { 
  FlaskConical, 
  ArrowRight, 
  Settings, 
  CheckSquare, 
  ShoppingBag, 
  Image as ImageIcon,
  Award,
  Layers,
  Sparkles,
  Zap,
  PackageOpen,
  Filter,
  ShieldCheck
} from "lucide-react";

export default function HomePage() {
  const basicLabs = labsRegistry.filter((l) => l.chapter === "Basic");
  const intermediateLabs = labsRegistry.filter((l) => l.chapter === "Intermediate");
  const advancedLabs = labsRegistry.filter((l) => l.chapter === "Advanced");

  // Renders a styled difficulty badge
  const DifficultyBadge = ({ difficulty }: { difficulty: LabItem["difficulty"] }) => {
    const colorClasses = {
      Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Hard: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };

    return (
      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${colorClasses[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  // Lab card helper
  const LabCard = ({ lab }: { lab: LabItem }) => {
    // Choose icon based on slug
    const icons = {
      theme: Settings,
      tasks: CheckSquare,
      shop: ShoppingBag,
      gallery: ImageIcon,
      lazy: PackageOpen,
      "search-params": Filter,
      rbac: ShieldCheck,
    };

    const IconComponent = icons[lab.slug as keyof typeof icons] || FlaskConical;

    return (
      <Link
        href={lab.path}
        className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300"
      >
        <div>
          {/* Card header */}
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-lg bg-primary/5 p-2.5 text-primary group-hover:bg-primary/10 transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <DifficultyBadge difficulty={lab.difficulty} />
          </div>

          <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {lab.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {lab.shortDescription}
          </p>

          {/* Key APIs list */}
          <div className="mt-4 border-t border-border/60 pt-4">
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">APIs Practiced</span>
            <div className="mt-2 flex flex-wrap gap-1">
              {lab.explanation.apis.slice(0, 2).map((api, idx) => (
                <span
                  key={idx}
                  className="rounded bg-muted px-2 py-0.5 text-[9px] font-mono text-muted-foreground border border-border/40"
                >
                  {api}
                </span>
              ))}
              {lab.explanation.apis.length > 2 && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                  +{lab.explanation.apis.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs font-semibold text-primary">
          <span>Enter Lab Workspace</span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Brand Headline Jumbotron */}
      <div className="rounded-2xl border border-border bg-gradient-to-tr from-card via-card to-primary/5 p-8 lg:p-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 text-primary/10 lg:text-primary/5 shrink-0 pointer-events-none">
          <FlaskConical className="h-32 w-32" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
            <Zap className="h-3.5 w-3.5" />
            React 19 & Next.js 16 Canary
          </span>
          
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Next JS Pragmatic Labs
          </h1>
          
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Welcome to the ultimate learning space for advanced web engineering patterns. This sandbox hosts interactive applications designed to master state, caching, mutations, and transitions in modern stack architectures.
          </p>
        </div>
      </div>

      {/* Chapter 1: Basic */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-border/80 pb-3">
          <div className="rounded-md bg-muted p-1 text-muted-foreground">
            <Award className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Basic Chapter</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {basicLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>

      {/* Chapter 2: Intermediate */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-border/80 pb-3">
          <div className="rounded-md bg-muted p-1 text-muted-foreground">
            <Layers className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Intermediate Chapter</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {intermediateLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>

      {/* Chapter 3: Advanced */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-border/80 pb-3">
          <div className="rounded-md bg-muted p-1 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Advanced Chapter</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advancedLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}
