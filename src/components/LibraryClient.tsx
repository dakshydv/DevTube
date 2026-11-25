"use client";

import Link from "next/link";
import type { Video } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";
import VideoCard from "./VideoCard";

export default function LibraryClient({ lookup }: { lookup: Record<string, Video> }) {
  const { saved, watched } = useUserState();
  const savedList = saved.map((id) => lookup[id]).filter(Boolean);
  const watchedList = watched.map((id) => lookup[id]).filter(Boolean);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Watch later ({savedList.length})</h2>
        {savedList.length === 0 ? (
          <Empty text="Click “Watch later” on any video to save it here." />
        ) : (
          <Grid list={savedList} />
        )}
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">History ({watchedList.length})</h2>
          {watchedList.length > 0 && (
            <button
              onClick={() => confirm("Clear your watch history?") && actions.clearHistory()}
              className="text-sm text-muted hover:text-fg"
            >
              Clear history
            </button>
          )}
        </div>
        {watchedList.length === 0 ? (
          <Empty text="Videos you mark as watched show up here, and on your learning-path progress." />
        ) : (
          <Grid list={watchedList} />
        )}
      </section>
    </div>
  );
}

function Grid({ list }: { list: Video[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {list.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
      {text}{" "}
      <Link href="/paths" className="text-accent hover:underline">
        Browse learning paths
      </Link>
    </div>
  );
}
