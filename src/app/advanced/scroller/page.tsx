import React from "react";
import { getLogs } from "@/lib/db";
import ScrollerContainer from "@/components/scroller-container";
import LabExplanation from "@/components/lab-explanation";

export default async function InfiniteScrollerPage() {
  // Query initial 5 logs
  const { logs, hasMore } = await getLogs(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Advanced Lab: Infinite Scroller Action
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice streaming pagination results, executing non-blocking updates using `useTransition`, and fetching offset chunks with Server Actions.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="infinite-scroller" />

      {/* Console log list scroller */}
      <div className="w-full">
        <ScrollerContainer initialLogs={logs} initialHasMore={hasMore} />
      </div>
    </div>
  );
}
