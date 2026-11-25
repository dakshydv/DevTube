"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Rocket,
  Check,
  CircleCheck,
  Clock,
  ExternalLink,
  EyeOff,
  MessageSquare,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { formatDuration, hnUrl, lobstersUrl, shortNumber, type Level, type Video } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";
import ThumbImg from "./ThumbImg";

const LEVEL_DOT: Record<Level, string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-sky-400",
  advanced: "bg-rose-400",
};
const LEVEL_NAME: Record<Level, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

/** Thumbnail badge styled like YouTube's duration badge. */
export function LevelChip({ level, className = "" }: { level: Level; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-black/80 px-1 py-px text-xs font-medium text-white ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[level]}`} />
      {LEVEL_NAME[level]}
    </span>
  );
}

export function DurationChip({ seconds, className = "" }: { seconds: number | null; className?: string }) {
  const text = formatDuration(seconds);
  if (!text) return null;
  return (
    <span className={`rounded bg-black/80 px-1 py-px text-xs font-medium tabular-nums text-white ${className}`}>{text}</span>
  );
}

function Thumb({ video, watched, small = false, className = "" }: { video: Video; watched: boolean; small?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-video overflow-hidden bg-hover ${className}`}>
      <ThumbImg id={video.id} frame={video.frame} className={`h-full w-full object-cover ${watched ? "opacity-70" : ""}`} />
      {!small && <LevelChip level={video.level} className="absolute bottom-1 left-1" />}
      <DurationChip seconds={video.duration} className="absolute bottom-1 right-1" />
      {watched && (
        <>
          <span className="absolute left-1 top-1 rounded bg-black/80 px-1 py-px text-[11px] font-medium uppercase tracking-wide text-white">
            Watched
          </span>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-hover-strong">
            <div className="h-full w-full bg-accent" />
          </div>
        </>
      )}
    </div>
  );
}

/** "2.4M views • 2021" / "645 points • 2017" — one plain line, YouTube style. */
function statsText(video: Video): string {
  const parts: string[] = [];
  if (video.points > 0) parts.push(`${shortNumber(video.points)} points`);
  else if (video.lbScore) parts.push(`${video.lbScore} points on Lobsters`);
  else if (video.views) parts.push(`${shortNumber(video.views)} views`);
  if (video.year) parts.push(String(video.year));
  return parts.join(" • ");
}

export default function VideoCard({
  video,
  href,
  compact = false,
  index,
  active = false,
}: {
  video: Video;
  href?: string;
  compact?: boolean;
  index?: number;
  active?: boolean;
}) {
  const { watched } = useUserState();
  const isWatched = watched.includes(video.id);
  const link = href ?? `/watch/${video.id}`;

  if (compact) {
    return (
      <div className={`group relative flex gap-2 rounded-lg pr-6 ${active ? "bg-hover" : ""}`}>
        {index !== undefined && (
          <span className="w-6 shrink-0 self-center text-center text-xs text-muted">{active ? "▶" : index}</span>
        )}
        <Link href={link} className="shrink-0">
          <Thumb video={video} watched={isWatched} small={index !== undefined} className={`${index !== undefined ? "w-[100px]" : "w-[168px]"} rounded-lg`} />
        </Link>
        <Link href={link} className="min-w-0 flex-1 py-0.5">
          <h4 className="line-clamp-2 text-sm font-medium leading-5">{video.title}</h4>
          <p className="mt-1 truncate text-xs leading-4 text-muted">{video.channel}</p>
          <p className="mt-0.5 truncate text-xs leading-4 text-muted">{statsText(video)}</p>
        </Link>
        <VideoMenu video={video} className="absolute right-0 top-0" />
      </div>
    );
  }

  return (
    <div className="group relative min-w-0">
      <Link href={link} className="block">
        <Thumb video={video} watched={isWatched} className="rounded-xl" />
      </Link>
      <div className="relative mt-2.5 pr-7">
        <Link href={link} className="block">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-[21px] text-fg">{video.title}</h3>
          <p className="mt-1 truncate text-[13px] leading-[18px] text-muted">{video.channel}</p>
          <p className="truncate text-[13px] leading-[18px] text-muted">{statsText(video)}</p>
          {video.curated ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs leading-[18px] text-muted">
              <Sparkles className="h-3 w-3" /> Editor&apos;s pick
            </p>
          ) : video.inspire ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs leading-[18px] text-muted">
              <Rocket className="h-3 w-3" /> Inspiration
            </p>
          ) : video.course ? (
            <p className="mt-0.5 truncate text-xs leading-[18px] text-muted">Course · {video.course}</p>
          ) : null}
        </Link>
        <VideoMenu video={video} className="absolute -right-2 -top-1.5" />
      </div>
    </div>
  );
}

/** The "⋮" menu next to every video, like YouTube's. */
export function VideoMenu({ video, className = "" }: { video: Video; className?: string }) {
  const { watched, saved } = useUserState();
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const open = pos !== null;
  const setOpen = (o: boolean) => {
    if (!o) return setPos(null);
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    // Fixed positioning so the menu isn't clipped by horizontally scrolling shelves; flip up near the bottom.
    const h = 200;
    const top = r.bottom + h > window.innerHeight ? r.top - h - 4 : r.bottom + 4;
    setPos({ top, left: Math.max(8, Math.min(r.right - 256, window.innerWidth - 264)) });
  };
  const ref = useRef<HTMLDivElement>(null);
  const isWatched = watched.includes(video.id);
  const isSaved = saved.includes(video.id);
  const hn = hnUrl(video);
  const lb = lobstersUrl(video);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPos(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPos(null);
    const dismiss = () => setPos(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  const item = "flex w-full items-center gap-4 px-4 py-2 text-left text-sm hover:bg-hover-strong";

  return (
    <div ref={ref} className={`z-20 ${className}`}>
      <button
        aria-label="Action menu"
        onClick={() => setOpen(!open)}
        className={`rounded-full p-1.5 hover:bg-hover-strong ${open ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100 max-lg:opacity-100"}`}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {open && (
        <div
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 w-64 overflow-hidden rounded-xl bg-elev py-2 shadow-2xl shadow-black/60"
        >
          <button className={item} onClick={() => {
              actions.toggleSaved(video.id);
              setOpen(false);
            }}>
            {isSaved ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            {isSaved ? "Remove from Watch later" : "Save to Watch later"}
          </button>
          <button className={item} onClick={() => {
              actions.toggleWatched(video.id);
              setOpen(false);
            }}>
            {isWatched ? <EyeOff className="h-5 w-5" /> : <CircleCheck className="h-5 w-5" />}
            {isWatched ? "Mark as not watched" : "Mark as watched"}
          </button>
          <div className="my-2 border-t border-hover-strong" />
          {hn && (
            <a className={item} href={hn} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <MessageSquare className="h-5 w-5" />
              HN discussion{video.comments > 0 ? ` (${video.comments} comments)` : ""}
            </a>
          )}
          {lb && (
            <a className={item} href={lb} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <MessageSquare className="h-5 w-5" />
              Lobsters discussion
            </a>
          )}
          <a
            className={item}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="h-5 w-5" />
            Open on YouTube
          </a>
        </div>
      )}
    </div>
  );
}
