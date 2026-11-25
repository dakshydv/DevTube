"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import { CATEGORY_MAP, LEVELS, thumb, type LearningPath, type Level } from "@/lib/meta";
import { useUserState } from "@/lib/store";

export default function PathCard({ path, levels }: { path: LearningPath; levels: Level[] }) {
  const { watched } = useUserState();
  const done = path.videos.filter((id) => watched.includes(id)).length;
  const pct = Math.round((done / path.videos.length) * 100);
  const cat = CATEGORY_MAP[path.category];
  const range = [...new Set(levels)].sort((a, b) => LEVELS.findIndex((l) => l.slug === a) - LEVELS.findIndex((l) => l.slug === b));
  const rangeText = range.length > 1 ? `${cap(range[0])} → ${cap(range[range.length - 1])}` : cap(range[0]);

  return (
    <Link
      href={`/paths/${path.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elev transition hover:border-white/20"
    >
      <div className="relative grid aspect-[16/8] grid-cols-2 grid-rows-2 gap-px bg-line">
        {path.videos.slice(0, 4).map((id) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={id} src={thumb(id)} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 group-hover:opacity-100" />
        ))}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-xs">
          <Route className="h-3.5 w-3.5" /> {path.videos.length} videos
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
          {cat.short} · {rangeText}
        </div>
        <h3 className="mt-1.5 font-semibold leading-snug group-hover:text-white">{path.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{path.description}</p>
        <div className="mt-auto pt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-hover">
            <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-muted">{done === 0 ? "Not started" : `${done}/${path.videos.length} watched`}</p>
        </div>
      </div>
    </Link>
  );
}

function cap(s?: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
