"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { personalize, type Video } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import VideoCard from "./VideoCard";

/** A horizontally scrolling row of videos, reordered for the viewer's level. */
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
    <section className="mb-10 border-t border-line pt-6">
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-xl font-bold">
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
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link href={href} className="rounded-full px-3 py-1.5 text-sm font-medium text-link hover:bg-[#263850]">
              See all
            </Link>
          )}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-hover hover:bg-hover-strong sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-hover hover:bg-hover-strong sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6">
        {list.map((v) => (
          <div key={v.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
