"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  DATES,
  DURATIONS,
  LEVELS,
  SORTS,
  TYPES,
  matchesFacets,
  sortVideos,
  type DateBucket,
  type DurationBucket,
  type SortKey,
  type Video,
  type VideoType,
} from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";
import FilterPanel, { type FilterColumn } from "./FilterPanel";
import VideoCard from "./VideoCard";

interface LibFilters {
  level: string | null;
  topic: string | null;
  type: VideoType | null;
  dur: DurationBucket | null;
  date: DateBucket | null;
  sort: "added" | SortKey;
}
const NONE: LibFilters = { level: null, topic: null, type: null, dur: null, date: null, sort: "added" };

const opts = (list: { slug: string; name: string }[]) => list.map((x) => ({ value: x.slug, label: x.name }));
const COLUMNS: FilterColumn[] = [
  { key: "level", title: "Level", options: opts(LEVELS) },
  { key: "topic", title: "Topic", options: opts(CATEGORIES.map((c) => ({ slug: c.slug, name: c.short }))) },
  { key: "type", title: "Type", options: opts(TYPES) },
  { key: "dur", title: "Duration", options: opts(DURATIONS) },
  { key: "date", title: "Upload date", options: opts(DATES) },
  {
    key: "sort",
    title: "Sort by",
    options: [{ value: "added", label: "Recently added" }, ...opts(SORTS.filter((s) => s.slug !== "discussed"))],
    required: true,
  },
];

export default function LibraryClient({ lookup }: { lookup: Record<string, Video> }) {
  const { saved, watched } = useUserState();
  const [f, setF] = useState<LibFilters>(NONE);

  const apply = useMemo(
    () => (ids: string[]) => {
      const list = ids
        .map((id) => lookup[id])
        .filter(Boolean)
        .filter(
          (v) =>
            (!f.level || v.level === f.level) &&
            (!f.topic || v.category === f.topic || v.tags.includes(f.topic as Video["category"])) &&
            matchesFacets(v, f),
        );
      return f.sort === "added" ? list : sortVideos(list, f.sort);
    },
    [lookup, f],
  );
  const savedList = apply(saved);
  const watchedList = apply(watched);
  const filtering = f.level || f.topic || f.type || f.dur || f.date;

  return (
    <div className="flex flex-col gap-10">
      {(saved.length > 0 || watched.length > 0) && (
        <FilterPanel
          columns={COLUMNS}
          values={f as unknown as Record<string, string | null>}
          onChange={(key, value) => setF((cur) => ({ ...cur, [key]: value ?? (key === "sort" ? "added" : null) }))}
          onClear={() => setF((cur) => ({ ...NONE, sort: cur.sort }))}
        />
      )}
      <section id="watch-later" className="scroll-mt-20">
        <h2 className="mb-4 text-xl font-bold">
          Watch later ({filtering ? `${savedList.length} of ${saved.length}` : savedList.length})
        </h2>
        {saved.length === 0 ? (
          <Empty text="Click “Watch later” on any video to save it here." />
        ) : savedList.length === 0 ? (
          <Empty text="Nothing saved matches these filters." />
        ) : (
          <Grid list={savedList} />
        )}
      </section>
      <section id="history" className="scroll-mt-20">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            History ({filtering ? `${watchedList.length} of ${watched.length}` : watchedList.length})
          </h2>
          {watched.length > 0 && (
            <button
              onClick={() => confirm("Clear your watch history?") && actions.clearHistory()}
              className="h-9 rounded-full px-4 text-sm font-medium text-link hover:bg-[#263850]"
            >
              Clear history
            </button>
          )}
        </div>
        {watched.length === 0 ? (
          <Empty text="Videos you mark as watched show up here, and on your learning-path progress." />
        ) : watchedList.length === 0 ? (
          <Empty text="Nothing in your history matches these filters." />
        ) : (
          <Grid list={watchedList} />
        )}
      </section>
    </div>
  );
}

function Grid({ list }: { list: Video[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-x-4 gap-y-8">
      {list.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-elev p-8 text-center text-sm text-muted">
      {text}{" "}
      <Link href="/paths" className="text-link hover:underline">
        Browse learning paths
      </Link>
    </div>
  );
}
