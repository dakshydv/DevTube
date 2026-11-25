"use client";

import Link from "next/link";
import { CheckCircle2, Play } from "lucide-react";
import { thumb, type LearningPath, type Video } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";
import LevelBadge from "./LevelBadge";

export default function PathPlaylist({ path, videos }: { path: LearningPath; videos: Video[] }) {
  const { watched } = useUserState();
  const firstUnwatched = videos.find((v) => !watched.includes(v.id)) ?? videos[0];
  const done = videos.filter((v) => watched.includes(v.id)).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          href={`/watch/${firstUnwatched.id}?path=${path.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Play className="h-4 w-4 fill-white" />
          {done === 0 ? "Start path" : done === videos.length ? "Watch again" : "Continue"}
        </Link>
        <div className="flex-1">
          <div className="h-2 max-w-sm overflow-hidden rounded-full bg-hover">
            <div className="h-full bg-accent" style={{ width: `${(done / videos.length) * 100}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">
            {done} of {videos.length} watched
          </p>
        </div>
      </div>
      <ol className="flex flex-col gap-2">
        {videos.map((v, i) => {
          const isDone = watched.includes(v.id);
          return (
            <li key={v.id} className="flex items-center gap-3 rounded-xl border border-line bg-elev p-2 pr-3 sm:gap-4">
              <span className="w-6 shrink-0 text-center text-sm text-muted">{i + 1}</span>
              <Link href={`/watch/${v.id}?path=${path.slug}`} className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg sm:w-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(v.id)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {isDone && <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" />}
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-medium leading-snug group-hover:text-white">{v.title}</h3>
                  <p className="mt-0.5 truncate text-sm text-muted">{v.channel}</p>
                  <LevelBadge level={v.level} className="mt-1" />
                </div>
              </Link>
              <button
                onClick={() => actions.toggleWatched(v.id)}
                title={isDone ? "Mark as not watched" : "Mark as watched"}
                className={`shrink-0 rounded-full p-1.5 ${isDone ? "text-emerald-400" : "text-muted hover:text-fg"}`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
