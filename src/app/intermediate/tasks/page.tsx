import React from "react";
import { getTasks } from "@/lib/db";
import TaskBoard from "@/components/task-board";
import LabExplanation from "@/components/lab-explanation";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intermediate Lab: Optimistic Task Board
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice React 19 Server Actions, form statuses, and optimistic client-side synchronization for lag-free UI transitions.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="optimistic-tasks" />

      {/* Kanban Board Container */}
      <div className="w-full">
        <TaskBoard initialTasks={tasks} />
      </div>
    </div>
  );
}
