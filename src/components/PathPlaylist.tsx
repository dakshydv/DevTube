"use client";

import Link from "next/link";
import { CircleCheck, ListVideo, Play } from "lucide-react";
import { formatRuntime, shortNumber, type Category, type LearningPath, type Video } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";
import ThumbImg from "./ThumbImg";
import { DurationChip, LevelChip } from "./VideoCard";

/** YouTube-style playlist page: blurred hero panel on the left, numbered list on the right. */
export default function PathPlaylist({ path, videos, cat }: { path: LearningPath; videos: Video[]; cat: Category }) {
  const { watched } = useUserState();
  const firstUnwatched = videos.find((v) => !watched.includes(v.id)) ?? videos[0];
  const done = videos.filter((v) => watched.includes(v.id)).length;
  const runtime = videos.reduce((t, v) => t + (v.duration ?? 0), 0);
  const label = done === 0 ? "Play all" : done === videos.length ? "Watch again" : "Continue";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <section className="relative isolate overflow-hidden rounded-2xl p-4 sm:p-6 lg:sticky lg:top-20 lg:w-[360px] lg:shrink-0">
        <ThumbImg id={videos[0].id} frame={videos[0].frame} lazy={false} className="absolute inset-0 -z-20 h-full w-full scale-150 object-cover blur-3xl" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/60 to-bg/95" />
        <Link href={`/watch/${firstUnwatched.id}?path=${path.slug}`} className="group relative block overflow-hidden rounded-xl">
          <ThumbImg id={videos[0].id} frame={videos[0].frame} lazy={false} className="aspect-video w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm font-medium opacity-0 transition group-hover:opacity-100">
            <Play className="h-5 w-5 fill-white" /> {label}
          </span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold leading-8 sm:mt-6 sm:text-[28px] sm:leading-9">{path.name}</h1>
        <Link href={`/c/${cat.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline">
          <span className="h-6 w-6 rounded-full" style={{ background: cat.color }} />
          {cat.name}
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
          <ListVideo className="h-4 w-4" /> {path.kind === "course" ? `Course${path.org ? ` · ${path.org}` : ""}` : "Learning path"} · {videos.length} videos{runtime ? ` · ${formatRuntime(runtime)}` : ""} · {done} watched
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-accent" style={{ width: `${(done / videos.length) * 100}%` }} />
        </div>
        <Link
          href={`/watch/${firstUnwatched.id}?path=${path.slug}`}
          className="mt-5 flex h-9 items-center justify-center gap-2 rounded-full bg-fg text-sm font-medium text-bg hover:bg-[#d9d9d9]"
        >
          <Play className="h-4 w-4 fill-bg" /> {label}
        </Link>
        <p className="mt-4 text-sm leading-5 text-white/80">{path.description}</p>
      </section>

      <ol className="min-w-0 flex-1">
        {videos.map((v, i) => {
          const isDone = watched.includes(v.id);
          return (
            <li key={v.id} className="group flex items-center gap-1.5 rounded-xl py-1 pr-1 hover:bg-hover sm:gap-2 sm:pr-2">
              <span className="w-5 shrink-0 text-center text-xs text-muted sm:w-8 sm:text-sm">{i + 1}</span>
              <Link href={`/watch/${v.id}?path=${path.slug}`} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg sm:w-40">
                  <ThumbImg id={v.id} frame={v.frame} className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 hidden sm:block"><LevelChip level={v.level} /></span>
                  <DurationChip seconds={v.duration} className="absolute bottom-1 right-1" />
                  {isDone && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5 sm:text-base sm:leading-[22px]">{v.title}</h3>
                  <p className="mt-1 truncate text-xs text-muted">
                    {v.channel}
                    {v.points > 0 ? ` · ${v.points} points` : v.views ? ` · ${shortNumber(v.views)} views` : ""}
                    {v.year && ` · ${v.year}`}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => actions.toggleWatched(v.id)}
                title={isDone ? "Mark as not watched" : "Mark as watched"}
                aria-label={isDone ? "Mark as not watched" : "Mark as watched"}
                className={`shrink-0 rounded-full p-2 hover:bg-hover-strong ${isDone ? "text-fg" : "text-muted"}`}
              >
                <CircleCheck className={`h-6 w-6 ${isDone ? "fill-accent text-white" : ""}`} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
