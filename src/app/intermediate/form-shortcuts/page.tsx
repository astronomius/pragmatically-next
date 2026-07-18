import React from "react";
import { getNotes } from "@/lib/db";
import NotepadEditor from "@/components/notepad-editor";
import LabExplanation from "@/components/lab-explanation";

export default async function FormShortcutsPage() {
  // Mock current user
  const mockUserId = "user-999";
  const notes = await getNotes(mockUserId);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intermediate Lab: Form Shortcuts & Action Bindings
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Practice React 19 action argument binding, programmatic submissions (`requestSubmit`), and handling multiple submission endpoints within a single form.
        </p>
      </div>

      {/* Lab Explanation Accordion */}
      <LabExplanation labSlug="form-shortcuts" />

      {/* Notepad Editor and Lists container */}
      <div className="w-full">
        <NotepadEditor initialNotes={notes} userId={mockUserId} />
      </div>
    </div>
  );
}
