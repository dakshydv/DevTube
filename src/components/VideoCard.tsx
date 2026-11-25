"use client";

import Link from "next/link";
import { CheckCircle2, MessageSquare, ArrowUp, Sparkles } from "lucide-react";
import { CATEGORY_MAP, thumb, type Video } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import LevelBadge from "./LevelBadge";

export default function VideoCard({
  video,
  href,
  compact = false,
  index,
}: {
  video: Video;
  href?: string;
  compact?: boolean;
  index?: number;
}) {
  const { watched } = useUserState();
  const isWatched = watched.includes(video.id);
  const cat = CATEGORY_MAP[video.category];
  const link = href ?? `/watch/${video.id}`;

  if (compact) {
    return (
      <Link href={link} className="group flex gap-3 rounded-lg p-1.5 hover:bg-hover">
        {index !== undefined && (
          <span className="w-5 shrink-0 self-center text-center text-xs text-muted">{index}</span>
        )}
        <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-md bg-elev">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(video.id)} alt="" loading="lazy" className="h-full w-full object-cover" />
          {isWatched && <WatchedOverlay />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-white">{video.title}</h4>
          <p className="mt-1 truncate text-xs text-muted">{video.channel}</p>
          <div className="mt-1 flex items-center gap-2">
            <LevelBadge level={video.level} />
            {video.points > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted">
                <ArrowUp className="h-3 w-3 text-accent" />
                {video.points}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={link} className="group block min-w-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-elev ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb(video.id)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {isWatched && <WatchedOverlay />}
        {video.curated && !isWatched && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
            <Sparkles className="h-3 w-3" /> Editor&apos;s pick
          </span>
        )}
      </div>
      <div className="mt-2.5 flex gap-2.5">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: cat?.color }} title={cat?.name} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-fg group-hover:text-white">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-[13px] text-muted">{video.channel}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-muted">
            <LevelBadge level={video.level} />
            {video.points > 0 && (
              <span className="inline-flex items-center gap-0.5" title="Hacker News points">
                <ArrowUp className="h-3.5 w-3.5 text-accent" />
                {video.points}
              </span>
            )}
            {video.comments > 0 && (
              <span className="inline-flex items-center gap-1" title="HN comments">
                <MessageSquare className="h-3 w-3" />
                {video.comments}
              </span>
            )}
            {video.hnYear && <span>· {video.hnYear}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function WatchedOverlay() {
  return (
    <div className="absolute inset-0 flex items-end bg-black/45">
      <span className="m-2 inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-emerald-300">
        <CheckCircle2 className="h-3 w-3" /> Watched
      </span>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-accent" />
    </div>
  );
}
