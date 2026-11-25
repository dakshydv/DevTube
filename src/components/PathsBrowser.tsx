"use client";

import { useMemo, useState } from "react";
import { LEVEL_RANK, type LearningPath, type Level } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import FilterPanel, { type FilterColumn } from "./FilterPanel";
import PathCard from "./PathCard";

export interface PathItem {
  path: LearningPath;
  levels: Level[];
  runtime: number;
  frames: Record<string, number | undefined>;
}
export interface PathSection {
  title: string;
  description: string;
  items: PathItem[];
}

interface PathFilters {
  kind: "path" | "course" | null;
  length: "short" | "medium" | "long" | null;
  start: Level | null;
  progress: "new" | "started" | "done" | null;
  sort: "default" | "shortest" | "longest" | "fewest" | "most";
}
const NONE: PathFilters = { kind: null, length: null, start: null, progress: null, sort: "default" };

const COLUMNS: FilterColumn[] = [
  { key: "kind", title: "Type", options: [{ value: "path", label: "Learning paths" }, { value: "course", label: "Full courses" }] },
  {
    key: "length",
    title: "Total length",
    options: [
      { value: "short", label: "Under 3 hours" },
      { value: "medium", label: "3–10 hours" },
      { value: "long", label: "Over 10 hours" },
    ],
  },
  {
    key: "start",
    title: "Starts at",
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    key: "progress",
    title: "Your progress",
    options: [
      { value: "new", label: "Not started" },
      { value: "started", label: "In progress" },
      { value: "done", label: "Completed" },
    ],
  },
  {
    key: "sort",
    title: "Sort by",
    required: true,
    options: [
      { value: "default", label: "Suggested order" },
      { value: "shortest", label: "Shortest first" },
      { value: "longest", label: "Longest first" },
      { value: "fewest", label: "Fewest videos" },
      { value: "most", label: "Most videos" },
    ],
  },
];

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4";

export default function PathsBrowser({ sections }: { sections: PathSection[] }) {
  const { watched } = useUserState();
  const [f, setF] = useState<PathFilters>(NONE);

  const shown = useMemo(() => {
    const seen = new Set(watched);
    const keep = ({ path, levels, runtime }: PathItem) => {
      if (f.kind && path.kind !== f.kind) return false;
      const h = runtime / 3600;
      if (f.length === "short" && h >= 3) return false;
      if (f.length === "medium" && (h < 3 || h > 10)) return false;
      if (f.length === "long" && h <= 10) return false;
      if (f.start) {
        const first = Math.min(...levels.map((l) => LEVEL_RANK[l]));
        if (first !== LEVEL_RANK[f.start]) return false;
      }
      if (f.progress) {
        const done = path.videos.filter((id) => seen.has(id)).length;
        if (f.progress === "new" && done > 0) return false;
        if (f.progress === "started" && (done === 0 || done === path.videos.length)) return false;
        if (f.progress === "done" && done < path.videos.length) return false;
      }
      return true;
    };
    const order = (list: PathItem[]) => {
      const arr = [...list];
      if (f.sort === "shortest") arr.sort((a, b) => a.runtime - b.runtime);
      if (f.sort === "longest") arr.sort((a, b) => b.runtime - a.runtime);
      if (f.sort === "fewest") arr.sort((a, b) => a.path.videos.length - b.path.videos.length);
      if (f.sort === "most") arr.sort((a, b) => b.path.videos.length - a.path.videos.length);
      return arr;
    };
    return sections.map((s) => ({
      ...s,
      paths: order(s.items.filter((i) => i.path.kind === "path" && keep(i))),
      courses: order(s.items.filter((i) => i.path.kind === "course" && keep(i))),
    }));
  }, [sections, f, watched]);

  const total = shown.reduce((t, s) => t + s.paths.length + s.courses.length, 0);

  return (
    <>
      <div className="sticky top-14 z-30 -mx-4 mt-6 bg-bg px-4 py-3 sm:-mx-6 sm:px-6">
        <FilterPanel
          columns={COLUMNS}
          values={f as unknown as Record<string, string | null>}
          onChange={(key, value) => setF((cur) => ({ ...cur, [key]: value ?? (key === "sort" ? "default" : null) }))}
          onClear={() => setF((cur) => ({ ...NONE, sort: cur.sort }))}
        />
      </div>

      {total === 0 && <p className="py-20 text-center text-muted">No paths or courses match these filters.</p>}

      {shown.map((s) =>
        s.paths.length + s.courses.length === 0 ? null : (
          <section key={s.title} className="mt-8 border-t border-line pt-8">
            <h2 className="text-2xl font-bold">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">{s.description}</p>
            {s.paths.length > 0 && (
              <>
                <h3 className="mb-3 mt-6 text-sm font-medium uppercase tracking-wide text-muted">Learning paths</h3>
                <div className={GRID}>
                  {s.paths.map((i) => (
                    <PathCard key={i.path.slug} path={i.path} levels={i.levels} runtime={i.runtime} frames={i.frames} />
                  ))}
                </div>
              </>
            )}
            {s.courses.length > 0 && (
              <>
                <h3 className="mb-3 mt-8 text-sm font-medium uppercase tracking-wide text-muted">Full courses</h3>
                <div className={GRID}>
                  {s.courses.map((i) => (
                    <PathCard key={i.path.slug} path={i.path} levels={i.levels} runtime={i.runtime} frames={i.frames} />
                  ))}
                </div>
              </>
            )}
          </section>
        ),
      )}
    </>
  );
}
