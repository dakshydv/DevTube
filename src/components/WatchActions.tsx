"use client";

import { Check, CircleCheck, Clock, ExternalLink, MessageSquare } from "lucide-react";
import { actions, useUserState } from "@/lib/store";

const PILL = "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors";

/** The pill row under the player (YouTube's like/share/save row). */
export default function WatchActions({ id, hn, comments }: { id: string; hn: string | null; comments: number }) {
  const { watched, saved } = useUserState();
  const isWatched = watched.includes(id);
  const isSaved = saved.includes(id);
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      <button
        onClick={() => actions.toggleWatched(id)}
        className={`${PILL} ${isWatched ? "bg-fg text-bg hover:bg-[#d9d9d9]" : "bg-hover hover:bg-hover-strong"}`}
      >
        <CircleCheck className="h-5 w-5" />
        {isWatched ? "Watched" : "Mark watched"}
      </button>
      <button onClick={() => actions.toggleSaved(id)} className={`${PILL} bg-hover hover:bg-hover-strong`}>
        {isSaved ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        {isSaved ? "Saved" : "Watch later"}
      </button>
      {hn && (
        <a href={hn} target="_blank" rel="noreferrer" className={`${PILL} bg-hover hover:bg-hover-strong`}>
          <MessageSquare className="h-5 w-5" />
          {comments > 0 ? `${comments} on HN` : "HN"}
        </a>
      )}
      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noreferrer"
        className={`${PILL} bg-hover hover:bg-hover-strong`}
      >
        <ExternalLink className="h-5 w-5" />
        YouTube
      </a>
    </div>
  );
}
