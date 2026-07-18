"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { Note } from "@/lib/db";
import { createDraftAction, publishNoteAction, NoteActionState } from "@/app/intermediate/form-shortcuts/actions";
import { 
  FileText, 
  Save, 
  Send, 
  Keyboard, 
  DraftingCompass, 
  CheckSquare, 
  Clock, 
  FolderPlus,
  Loader2,
  Info
} from "lucide-react";

interface NotepadEditorProps {
  initialNotes: Note[];
  userId: string;
}

const initialActionState: NoteActionState = {
  success: false,
  error: null,
  message: null
};

export default function NotepadEditor({ initialNotes, userId }: NotepadEditorProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Bind actions with userId parameter
  const boundDraftAction = createDraftAction.bind(null, userId);
  const boundPublishAction = publishNoteAction.bind(null, userId);

  // Register separate action states
  const [draftState, runDraftAction, isDraftPending] = useActionState(
    boundDraftAction,
    initialActionState
  );

  const [publishState, runPublishAction, isPublishPending] = useActionState(
    boundPublishAction,
    initialActionState
  );

  const isPending = isDraftPending || isPublishPending;

  // Clear inputs on success
  useEffect(() => {
    if ((draftState.success || publishState.success) && formRef.current) {
      formRef.current.reset();
    }
  }, [draftState.success, publishState.success]);

  // Command + Enter keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      // Programmatically trigger default form action (Publish Note)
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Editor Form Panel */}
        <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4 border-b border-border pb-3">
            <FolderPlus className="h-5 w-5 text-primary" />
            Notepad Workspace
          </h2>

          <form 
            ref={formRef} 
            action={runPublishAction} // Default action is Publish
            className="space-y-4"
          >
            {/* Feedback notifications */}
            {(draftState.error || publishState.error) && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500 font-medium">
                {draftState.error || publishState.error}
              </div>
            )}
            {(draftState.message || publishState.message) && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-medium">
                {draftState.message || publishState.message}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Note Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="e.g. Server Component rendering lifecycles"
                required
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="content" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Content Pad
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted border border-border/80 px-2 py-0.5 rounded">
                  <Keyboard className="h-3 w-3 text-primary" />
                  <span>Cmd + Enter to Publish</span>
                </span>
              </div>
              <textarea
                name="content"
                id="content"
                placeholder="Type your notes here..."
                rows={6}
                onKeyDown={handleKeyDown}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                formAction={runDraftAction} // Override default action
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                {isDraftPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Save className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Save Draft</span>
              </button>
              
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isPublishPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  <Send className="h-4 w-4 text-primary-foreground" />
                )}
                <span>Publish Note</span>
              </button>
            </div>
          </form>
        </div>

        {/* Saved Notes Panel */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <FileText className="h-5 w-5 text-primary" />
            Stored Notes ({initialNotes.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {initialNotes.length > 0 ? (
              initialNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm hover:border-muted-foreground/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                      {note.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                        note.isDraft
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                      }`}
                    >
                      {note.isDraft ? (
                        <>
                          <DraftingCompass className="h-2.5 w-2.5" />
                          Draft
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-2.5 w-2.5" />
                          Published
                        </>
                      )}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {note.content || "Empty content note."}
                  </p>
                  
                  <div className="mt-3 border-t border-border/60 pt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <span className="text-xs text-muted-foreground/60">No notes recorded yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info warning box */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-foreground">Why this matters:</span> In React 19, multiple buttons can execute separate Server Actions within the same form via <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">formAction</code>. Programmatic submission using <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">form.requestSubmit()</code> ensures that browser validators and React action statuses are fully triggered.
        </div>
      </div>
    </div>
  );
}
