"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, LEVELS, SORTS, sortVideos, type CategorySlug, type Level, type SortKey, type Video } from "@/lib/meta";
import VideoCard from "./VideoCard";

export interface GridFilters {
  q: string;
  level: Level | "all";
  category: CategorySlug | "all";
  sort: SortKey;
}

const PAGE = 48;

/** Filterable, sortable grid. Filter state is owned by the parent so it can sync with the URL if it wants to. */
export default function VideoGrid({
  videos,
  filters,
  onChange,
  showCategory = true,
}: {
  videos: Video[];
  filters: GridFilters;
  onChange: (f: GridFilters) => void;
  showCategory?: boolean;
}) {
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = videos.filter((v) => {
      if (filters.level !== "all" && v.level !== filters.level) return false;
      if (filters.category !== "all" && v.category !== filters.category && !v.tags.includes(filters.category)) return false;
      if (terms.length) {
        const hay = `${v.title} ${v.ytTitle ?? ""} ${v.channel} ${v.tags.join(" ")}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      }
      return true;
    });
    return sortVideos(list, filters.sort);
  }, [videos, filters]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0, beginner: 0, intermediate: 0, advanced: 0 };
    const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    for (const v of videos) {
      if (filters.category !== "all" && v.category !== filters.category && !v.tags.includes(filters.category)) continue;
      if (terms.length) {
        const hay = `${v.title} ${v.ytTitle ?? ""} ${v.channel} ${v.tags.join(" ")}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) continue;
      }
      c.all++;
      c[v.level]++;
    }
    return c;
  }, [videos, filters.q, filters.category]);

  const set = (patch: Partial<GridFilters>) => {
    setShown(PAGE);
    onChange({ ...filters, ...patch });
  };

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-5 flex flex-wrap items-center gap-2 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        {[{ slug: "all" as const, name: "All levels" }, ...LEVELS].map((l) => (
          <button
            key={l.slug}
            onClick={() => set({ level: l.slug })}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              filters.level === l.slug ? "bg-fg font-medium text-bg" : "bg-hover hover:bg-white/15"
            }`}
          >
            {l.name} <span className="opacity-60">{counts[l.slug]}</span>
          </button>
        ))}
        <div className="ml-auto flex flex-wrap gap-2">
          {showCategory && (
            <select
              value={filters.category}
              onChange={(e) => set({ category: e.target.value as CategorySlug | "all" })}
              className="rounded-lg border border-line bg-elev px-3 py-1.5 text-sm outline-none"
            >
              <option value="all">All topics</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <select
            value={filters.sort}
            onChange={(e) => set({ sort: e.target.value as SortKey })}
            className="rounded-lg border border-line bg-elev px-3 py-1.5 text-sm outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted">No videos match these filters. Try a different level or search term.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filtered.slice(0, shown).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
          {shown < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShown((s) => s + PAGE)}
                className="rounded-full border border-line px-6 py-2 text-sm hover:bg-hover"
              >
                Show more ({filtered.length - shown} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
