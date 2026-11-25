"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LEVEL_RANK, type Level, type Video } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import VideoCard from "./VideoCard";

/** Reorder a list for the viewer's level: their level first, one step up next, far-above hidden. */
export function personalize(list: Video[], level: Level | "all"): Video[] {
  if (level === "all") return list;
  const r = LEVEL_RANK[level];
  const weight = (v: Video) => {
    const d = LEVEL_RANK[v.level] - r;
    return d === 0 ? 0 : d === 1 ? 1 : d < 0 ? 2 : 3;
  };
  return list
    .filter((v) => LEVEL_RANK[v.level] - r <= 1)
    .map((v, i) => ({ v, i }))
    .sort((a, b) => weight(a.v) - weight(b.v) || a.i - b.i)
    .map((x) => x.v);
}

export default function Shelf({
  title,
  subtitle,
  href,
  videos,
  color,
  adapt = true,
  limit = 14,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  videos: Video[];
  color?: string;
  adapt?: boolean;
  limit?: number;
}) {
  const { level } = useUserState();
  const ref = useRef<HTMLDivElement>(null);
  const list = (adapt ? personalize(videos, level) : videos).slice(0, limit);
  if (list.length === 0) return null;
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-end justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {color && <span className="h-3 w-3 rounded-full" style={{ background: color }} />}
            {href ? (
              <Link href={href} className="hover:underline">
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {href && (
            <Link href={href} className="mr-2 text-sm text-accent hover:underline">
              See all
            </Link>
          )}
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="hidden rounded-full border border-line p-1.5 hover:bg-hover sm:block">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="hidden rounded-full border border-line p-1.5 hover:bg-hover sm:block">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 sm:px-6">
        {list.map((v) => (
          <div key={v.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
