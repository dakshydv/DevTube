"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SkipForward } from "lucide-react";
import type { LearningPath, Video } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import VideoCard from "./VideoCard";

/**
 * When the watch page is opened from a learning path (?path=slug), show the playlist panel YouTube shows
 * next to the player. Otherwise show nothing.
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
  const { watched } = useUserState();
  const slug = params.get("path");
  const path = paths.find((p) => p.slug === slug) ?? null;
  if (!path) return null;
  const idx = path.videos.indexOf(currentId);
  const next = idx >= 0 && idx < path.videos.length - 1 ? videos[path.videos[idx + 1]] : null;
  const done = path.videos.filter((id) => watched.includes(id)).length;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-line">
      <div className="flex items-start justify-between gap-2 bg-elev px-4 pb-3 pt-3">
        <div className="min-w-0">
          <Link href={`/paths/${path.slug}`} className="line-clamp-1 text-xl font-bold hover:underline">
            {path.name}
          </Link>
          <p className="mt-1 text-xs text-muted">
            {path.kind === "course" ? "Course" : "Learning path"} · {idx + 1} / {path.videos.length} · {done} watched
          </p>
        </div>
        {next && (
          <Link
            href={`/watch/${next.id}?path=${path.slug}`}
            title={`Next: ${next.title}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-fg px-3 text-sm font-medium text-bg hover:bg-[#d9d9d9]"
          >
            <SkipForward className="h-4 w-4 fill-bg" /> Next
          </Link>
        )}
      </div>
      <div className="no-scrollbar max-h-[400px] overflow-y-auto py-2 pr-2">
        {path.videos.map((id, i) =>
          videos[id] ? (
            <VideoCard
              key={id}
              video={videos[id]}
              href={`/watch/${id}?path=${path.slug}`}
              compact
              index={i + 1}
              active={id === currentId}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
