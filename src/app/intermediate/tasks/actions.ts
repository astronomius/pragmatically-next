"use server";

import { revalidatePath } from "next/cache";
import { createTask, updateTaskStatus, deleteTask, Task } from "@/lib/db";

// Server action to add a task
export async function addTaskAction(prevState: unknown, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = (formData.get("status") as Task["status"]) || "todo";

  // Simple validation
  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" };
  }

  try {
    // Add artificial delay to simulate network latency, making the optimistic state visible
    await new Promise((resolve) => setTimeout(resolve, 800));

    await createTask(title, description || "", status);
    revalidatePath("/intermediate/tasks");
    return { success: true, error: null };
  } catch (e) {
    console.error("Action error creating task:", e);
    return { success: false, error: "Failed to create task" };
  }
}

// Server action to update task status
export async function updateTaskStatusAction(id: string, newStatus: Task["status"]) {
  try {
    // Latency simulator
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updated = await updateTaskStatus(id, newStatus);
    if (!updated) {
      return { success: false, error: "Task not found" };
    }
    revalidatePath("/intermediate/tasks");
    return { success: true, error: null };
  } catch (e) {
    console.error("Action error updating task status:", e);
    return { success: false, error: "Failed to update task status" };
  }
}

// Server action to delete task
export async function deleteTaskAction(id: string) {
  try {
    // Latency simulator
    await new Promise((resolve) => setTimeout(resolve, 600));

    const deleted = await deleteTask(id);
    if (!deleted) {
      return { success: false, error: "Task not found" };
    }
    revalidatePath("/intermediate/tasks");
    return { success: true, error: null };
  } catch (e) {
    console.error("Action error deleting task:", e);
    return { success: false, error: "Failed to delete task" };
  }
}
