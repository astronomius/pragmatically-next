"use server";

import { revalidatePath } from "next/cache";
import { createNote } from "@/lib/db";

export interface NoteActionState {
  success: boolean;
  error: string | null;
  message: string | null;
}

// Server action to save a draft note
export async function createDraftAction(
  userId: string,
  prevState: NoteActionState,
  formData: FormData
): Promise<NoteActionState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required to save draft", message: null };
  }

  try {
    // Add artificial delay to make saving animation visible
    await new Promise((resolve) => setTimeout(resolve, 800));

    await createNote(title, content || "", true, userId);
    revalidatePath("/intermediate/form-shortcuts");
    return { success: true, error: null, message: "Draft saved successfully!" };
  } catch (e) {
    console.error("Action error saving draft:", e);
    return { success: false, error: "Failed to save draft", message: null };
  }
}

// Server action to publish a note
export async function publishNoteAction(
  userId: string,
  prevState: NoteActionState,
  formData: FormData
): Promise<NoteActionState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required to publish note", message: null };
  }

  try {
    // Add artificial delay to simulate server write
    await new Promise((resolve) => setTimeout(resolve, 800));

    await createNote(title, content || "", false, userId);
    revalidatePath("/intermediate/form-shortcuts");
    return { success: true, error: null, message: "Note published successfully!" };
  } catch (e) {
    console.error("Action error publishing note:", e);
    return { success: false, error: "Failed to publish note", message: null };
  }
}
