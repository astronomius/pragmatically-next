"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { Task } from "@/lib/db";
import { 
  updateTaskStatusAction, 
  deleteTaskAction, 
  addTaskAction 
} from "@/app/intermediate/tasks/actions";
import { 
  Trash2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Play,
  X
} from "lucide-react";

interface TaskBoardProps {
  initialTasks: Task[];
}

type OptimisticAction =
  | { type: "add"; payload: Task }
  | { type: "update-status"; payload: { id: string; status: Task["status"] } }
  | { type: "delete"; payload: string };

export default function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Optimistic list of tasks
  const [optimisticTasks, setOptimisticTasks] = useOptimistic<Task[], OptimisticAction>(
    initialTasks,
    (state, action) => {
      switch (action.type) {
        case "add":
          return [action.payload, ...state];
        case "update-status":
          return state.map((t) =>
            t.id === action.payload.id ? { ...t, status: action.payload.status } : t
          );
        case "delete":
          return state.filter((t) => t.id !== action.payload);
        default:
          return state;
      }
    }
  );

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Add task handler
  const handleAddTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = (formData.get("status") as Task["status"]) || "todo";

    if (!title || title.trim() === "") return;

    // Create a temporary optimistic task object
    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);
    const tempTask: Task = {
      id: tempId,
      title,
      description: description || "",
      status,
      createdAt: new Date().toISOString(),
    };

    // Close form early for instant visual transition
    setShowNewForm(false);

    // Run action inside transition
    startTransition(async () => {
      setOptimisticTasks({ type: "add", payload: tempTask });
      const result = await addTaskAction(null, formData);
      if (!result.success) {
        alert(result.error || "Failed to add task.");
      }
    });
  };

  // Move task status handler (drag and drop / click triggers)
  const handleUpdateStatus = (id: string, newStatus: Task["status"]) => {
    startTransition(async () => {
      setOptimisticTasks({ type: "update-status", payload: { id, status: newStatus } });
      const result = await updateTaskStatusAction(id, newStatus);
      if (!result.success) {
        alert(result.error || "Failed to update task.");
      }
    });
  };

  // Delete task handler
  const handleDeleteTask = (id: string) => {
    startTransition(async () => {
      setOptimisticTasks({ type: "delete", payload: id });
      const result = await deleteTaskAction(id);
      if (!result.success) {
        alert(result.error || "Failed to delete task.");
      }
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      handleUpdateStatus(id, status);
    }
    setDraggingId(null);
  };

  // Column filter helper
  const getColumnTasks = (status: Task["status"]) => {
    return optimisticTasks.filter((t) => t.status === status);
  };

  // Render a single task card
  const renderTaskCard = (task: Task) => {
    const isTemp = task.id.startsWith("temp-");
    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        className={`group relative rounded-lg border p-4 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow ${
          isTemp 
            ? "border-dashed border-primary/40 bg-primary/5 animate-pulse" 
            : "border-border bg-card hover:border-muted-foreground/30"
        }`}
      >
        {/* Sync spinner indicator */}
        {isTemp && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-primary font-semibold">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Syncing</span>
          </div>
        )}

        <h4 className={`font-semibold text-sm text-foreground ${isTemp ? "text-primary" : ""}`}>
          {task.title}
        </h4>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description || "No description provided."}
        </p>

        {/* Date and manual action buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(task.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Quick manual transitions */}
            {task.status !== "todo" && (
              <button
                onClick={() => handleUpdateStatus(task.id, task.status === "done" ? "in-progress" : "todo")}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Move Left"
                disabled={isTemp}
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
            )}

            {task.status !== "done" && (
              <button
                onClick={() => handleUpdateStatus(task.id, task.status === "todo" ? "in-progress" : "done")}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Move Right"
                disabled={isTemp}
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            )}

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="Delete Task"
              disabled={isTemp}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Column component helper
  const renderBoardColumn = (status: Task["status"], label: string, Icon: React.ComponentType<{ className?: string }>, colorClass: string) => {
    const tasks = getColumnTasks(status);
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
        className={`flex flex-col rounded-xl border border-border bg-muted/40 p-4 transition-all duration-200 ${
          draggingId ? "ring-2 ring-primary/10 ring-offset-2 bg-muted/60" : ""
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`h-4.5 w-4.5 ${colorClass}`} />
            <span className="text-sm font-bold text-foreground">{label}</span>
          </div>
          <span className="rounded-full bg-muted border border-border px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        {/* Task Cards Stack */}
        <div className="flex flex-1 flex-col gap-3 min-h-[300px]">
          {tasks.length > 0 ? (
            tasks.map((task) => renderTaskCard(task))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center border border-dashed border-border/60 rounded-lg p-6 text-center">
              <span className="text-xs text-muted-foreground/60">No tasks in this stage.</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action panel at top */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>Saving updates...</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          {showNewForm ? <X className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
          <span>{showNewForm ? "Cancel" : "Add Ticket"}</span>
        </button>
      </div>

      {/* Add New Task Form Modal Panel */}
      {showNewForm && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in-50 duration-200">
          <h3 className="text-sm font-bold text-foreground mb-4">Create New Ticket</h3>
          <form onSubmit={handleAddTaskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-xs font-medium text-muted-foreground">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g. Write unit tests for db helper"
                  required
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
                  Starting Column
                </label>
                <select
                  name="status"
                  id="status"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                Task Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Explain what needs to be solved in detail..."
                rows={3}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {renderBoardColumn("todo", "To Do", Circle, "text-zinc-400")}
        {renderBoardColumn("in-progress", "In Progress", Play, "text-primary")}
        {renderBoardColumn("done", "Done", CheckCircle2, "text-emerald-500")}
      </div>
    </div>
  );
}
