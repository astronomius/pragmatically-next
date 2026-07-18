"use server";

import { getLogs, Log } from "@/lib/db";

// Server Action to fetch logs with offset and limit
export async function fetchMoreLogsAction(
  offset: number,
  limit: number = 5
): Promise<{ success: boolean; data: Log[]; hasMore: boolean; error: string | null }> {
  try {
    // Add artificial delay to highlight the useTransition loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = await getLogs(offset, limit);
    return {
      success: true,
      data: result.logs,
      hasMore: result.hasMore,
      error: null
    };
  } catch (e) {
    console.error("Action error fetching logs:", e);
    return {
      success: false,
      data: [],
      hasMore: false,
      error: "Failed to load logs"
    };
  }
}
