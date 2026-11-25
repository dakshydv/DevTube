"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Route } from "lucide-react";
import type { LearningPath, Video } from "@/lib/meta";
import VideoCard from "./VideoCard";

/**
 * When the watch page is opened from a learning path (?path=slug), show the playlist with
 * the current position and a "next" button. Otherwise show nothing.
 */
export default function PathNav({
  currentId,
  paths,
  videos,
}: {
  currentId: string;
  paths: LearningPath[];
  videos: Record<string, Video>;
}) {
  const params = useSearchParams();
  const slug = params.get("path");
  const path = paths.find((p) => p.slug === slug) ?? null;
  if (!path) return null;
  const idx = path.videos.indexOf(currentId);
  const next = idx >= 0 && idx < path.videos.length - 1 ? videos[path.videos[idx + 1]] : null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-line bg-elev">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <Link href={`/paths/${path.slug}`} className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
            <Route className="h-3.5 w-3.5" /> Learning path
          </div>
          <div className="truncate font-semibold hover:underline">{path.name}</div>
        </Link>
        <span className="shrink-0 text-xs text-muted">
          {idx + 1} / {path.videos.length}
        </span>
      </div>
      {next && (
        <Link
          href={`/watch/${next.id}?path=${path.slug}`}
          className="flex items-center justify-between gap-2 bg-accent/10 px-4 py-2.5 text-sm hover:bg-accent/20"
        >
          <span className="truncate">
            <span className="text-muted">Next: </span>
            {next.title}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Link>
      )}
      <div className="no-scrollbar max-h-[360px] overflow-y-auto p-2">
        {path.videos.map((id, i) =>
          videos[id] ? (
            <div key={id} className={id === currentId ? "rounded-lg bg-hover" : ""}>
              <VideoCard video={videos[id]} href={`/watch/${id}?path=${path.slug}`} compact index={i + 1} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
