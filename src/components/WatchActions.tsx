"use client";

import { Bookmark, BookmarkCheck, CheckCircle2, Circle } from "lucide-react";
import { actions, useUserState } from "@/lib/store";

export default function WatchActions({ id }: { id: string }) {
  const { watched, saved } = useUserState();
  const isWatched = watched.includes(id);
  const isSaved = saved.includes(id);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => actions.toggleWatched(id)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isWatched ? "bg-emerald-500/20 text-emerald-300" : "bg-hover hover:bg-white/15"
        }`}
      >
        {isWatched ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {isWatched ? "Watched" : "Mark as watched"}
      </button>
      <button
        onClick={() => actions.toggleSaved(id)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isSaved ? "bg-accent/20 text-accent" : "bg-hover hover:bg-white/15"
        }`}
      >
        {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {isSaved ? "Saved" : "Watch later"}
      </button>
    </div>
  );
}
