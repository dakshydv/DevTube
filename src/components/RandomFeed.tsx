"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shuffle, X } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_MAP,
  DATES,
  DURATIONS,
  FEATURES,
  LEVELS,
  TYPES,
  matchesFacets,
  LEVEL_RANK,
  SORTS,
  matchesFilter,
  popularity,
  sortVideos,
  type CategorySlug,
  type DateBucket,
  type DurationBucket,
  type Feature,
  type FeedFilter,
  type Level,
  type SortKey,
  type Video,
  type VideoType,
} from "@/lib/meta";
import FilterPanel, { type FilterColumn } from "./FilterPanel";
import { useUserState } from "@/lib/store";
import VideoCard from "./VideoCard";

type FeedRow = [
  id: string, title: string, channel: string, category: CategorySlug, level: number, points: number, views: number,
  year: number, duration: number, flags: number, course: string, lbScore: number, lbId: string, hnId: string,
  comments: number, sub: string, tags: string, frame: 1 | 2 | 3,
];

const STEP = 24;
const SEED_KEY = "devtube:feed-seed";
const GRID = "grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-x-4 gap-y-8";

function toVideo(r: FeedRow): Video {
  const [id, title, channel, category, lvl, points, views, year, duration, flags, course, lbScore, lbId, hnId, comments, sub, tags, frame] = r;
  return {
    id, title, ytTitle: null, channel, category, sub, frame, tags: [category, ...(tags ? (tags.split(" ") as CategorySlug[]) : [])], level: LEVELS[lvl].slug, points, comments,
    hnId: hnId || null, year: year || null, duration: duration || null, curated: !!(flags & 1), inspire: !!(flags & 2),
    source: hnId ? "hn" : "channel", views: views || null, course: course || undefined,
    lbScore: lbScore || undefined, lbId: lbId || null,
  };
}

/** Small seeded PRNG so the same session keeps the same order (e.g. when you come back from a video). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readSeed(): number {
  try {
    const s = sessionStorage.getItem(SEED_KEY);
    if (s) return Number(s);
  } catch {}
  return newSeed();
}

function newSeed(): number {
  const s = Math.floor(Math.random() * 2 ** 31);
  try {
    sessionStorage.setItem(SEED_KEY, String(s));
  } catch {}
  return s;
}

/**
 * YouTube-style random feed: a weighted shuffle (popular videos and your level come up more often, videos far above
 * your level and ones you've watched rarely), then spread out so one channel or topic doesn't clump together.
 */
function shuffleFeed(videos: Video[], seed: number, level: Level | "all", watched: Set<string>): Video[] {
  const rand = mulberry32(seed);
  const keyed = videos.map((v) => {
    let w = 1 + Math.log10(popularity(v) / 50_000 + 1);
    if (v.curated) w *= 1.5;
    if (level !== "all") {
      const d = LEVEL_RANK[v.level] - LEVEL_RANK[level];
      w *= d === 0 ? 2 : d === 1 ? 1.2 : d < 0 ? 0.6 : 0.08;
    }
    if (watched.has(v.id)) w *= 0.05;
    return { v, k: Math.pow(rand(), 1 / w) };
  });
  keyed.sort((a, b) => b.k - a.k);
  const order = keyed.map((x) => x.v);

  // De-clump: avoid the same channel within 4 slots or the same topic back to back.
  const out: Video[] = [];
  const pending = [...order];
  while (pending.length) {
    const recent = out.slice(-4);
    let i = pending.findIndex(
      (v, j) =>
        j < 40 &&
        !recent.some((r) => r.channel === v.channel) &&
        (out.length === 0 || out[out.length - 1].category !== v.category),
    );
    if (i < 0) i = 0;
    out.push(pending.splice(i, 1)[0]);
  }
  return out;
}

type FeedSort = "shuffle" | SortKey;

/** Search, level, topic and sort live in the URL so any view can be shared or bookmarked. */
function useFeedParams() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lvl = sp.get("level");
  const topic = sp.get("topic");
  const sort = sp.get("sort");
  const pick = <T extends string>(key: string, list: { slug: T }[]) => {
    const v = sp.get(key);
    return (list.some((x) => x.slug === v) ? v : null) as T | null;
  };
  const params = {
    date: pick<DateBucket>("date", DATES),
    type: pick<VideoType>("type", TYPES),
    dur: pick<DurationBucket>("dur", DURATIONS),
    feat: pick<Feature>("feat", FEATURES),
    q: sp.get("q") ?? "",
    level: (LEVELS.some((l) => l.slug === lvl) ? lvl : null) as Level | null,
    topic: (topic && topic in CATEGORY_MAP ? topic : null) as CategorySlug | null,
    sort: (SORTS.some((s) => s.slug === sort) ? sort : "shuffle") as FeedSort,
  };
  const set = useCallback(
    (patch: Partial<typeof params>) => {
      const next = { ...params, ...patch };
      const p = new URLSearchParams();
      if (next.q) p.set("q", next.q);
      if (next.level) p.set("level", next.level);
      if (next.topic) p.set("topic", next.topic);
      for (const k of ["date", "type", "dur", "feat"] as const) if (next[k]) p.set(k, next[k]!);
      if (next.sort !== "shuffle") p.set("sort", next.sort);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, pathname, params.q, params.level, params.topic, params.sort, params.date, params.type, params.dur, params.feat],
  );
  return [params, set] as const;
}

function matchesQuery(v: Video, terms: string[]) {
  if (!terms.length) return true;
  const hay = `${v.title} ${v.channel} ${v.course ?? ""} ${v.tags.map((t) => CATEGORY_MAP[t]?.name ?? t).join(" ")}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function Skeleton() {
  return (
    <div className={GRID} aria-busy>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i}>
          <div className="aspect-video animate-pulse rounded-xl bg-hover" />
          <div className="mt-3 flex gap-3">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-hover" />
            <div className="flex-1 space-y-2">
              <div className="h-4 animate-pulse rounded bg-hover" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-hover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The main video grid (Home and every topic page). By default it's a YouTube-style shuffle tuned to your level;
 * search, a level filter, a topic filter and a fixed sort order turn it into a precise browser.
 */
export default function RandomFeed(props: { filter?: FeedFilter; intro?: boolean }) {
  return (
    <Suspense fallback={<div className={props.intro === false ? "pb-16" : "px-4 pb-16 pt-4 sm:px-6"}><Skeleton /></div>}>
      <Feed {...props} />
    </Suspense>
  );
}

function Feed({ filter = {}, intro = true }: { filter?: FeedFilter; intro?: boolean }) {
  const { level: myLevel, watched } = useUserState();
  const [params, setParams] = useFeedParams();
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [shown, setShown] = useState(STEP);

  useEffect(() => {
    // Seed lives in sessionStorage, so it can only be read on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeed(readSeed());
    let alive = true;
    fetch("/feed.json")
      .then((r) => r.json())
      .then((rows: FeedRow[]) => alive && setVideos(rows.map(toVideo)))
      .catch(() => alive && setVideos([]));
    return () => {
      alive = false;
    };
  }, []);

  // Snapshot of watched videos for the "Not watched yet" filter; refreshed when the filters change, not on every click.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const watchedSet = useMemo(() => new Set(watched), [params.feat]);
  const terms = useMemo(() => params.q.toLowerCase().split(/\s+/).filter(Boolean), [params.q]);

  // Everything matching the page + search + topic, before the level filter (so the level chips can show counts).
  const base = useMemo(
    () =>
      videos?.filter(
        (v) =>
          matchesFilter(v, filter) &&
          (!params.topic || matchesFilter(v, { category: params.topic })) &&
          matchesQuery(v, terms) &&
          matchesFacets(v, params, watchedSet),
      ) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videos, filter.category, filter.sub, filter.special, params.topic, terms, params.date, params.type, params.dur, params.feat],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base?.length ?? 0, beginner: 0, intermediate: 0, advanced: 0 };
    for (const v of base ?? []) c[v.level]++;
    return c;
  }, [base]);

  // Watched status is applied at shuffle time only, so marking a video as watched doesn't make the feed jump around.
  const feed = useMemo(() => {
    if (!base || seed === null) return null;
    const list = params.level ? base.filter((v) => v.level === params.level) : base;
    if (params.sort !== "shuffle") return sortVideos(list, params.sort);
    return shuffleFeed(list, seed, params.level ? "all" : myLevel, new Set(watched));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, seed, params.level, params.sort, myLevel]);

  // Start from the top of the list whenever what's being shown changes.
  const viewKey = `${params.q}|${params.level}|${params.topic}|${params.sort}|${params.date}|${params.type}|${params.dur}|${params.feat}|${seed}`;
  const [lastKey, setLastKey] = useState(viewKey);
  if (lastKey !== viewKey) {
    setLastKey(viewKey);
    setShown(STEP);
  }

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setShown((s) => s + STEP), { rootMargin: "1000px" });
    io.observe(el);
    return () => io.disconnect();
  }, [feed, shown]);

  const reshuffle = () => {
    setSeed(newSeed());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chip = (active: boolean) =>
    `h-8 shrink-0 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors ${
      active ? "bg-fg text-bg" : "bg-hover hover:bg-hover-strong"
    }`;
  const select = "h-8 rounded-lg bg-hover px-3 text-sm font-medium outline-none hover:bg-hover-strong";
  const opts = (list: { slug: string; name: string }[]) => list.map((x) => ({ value: x.slug, label: x.name }));
  const columns: FilterColumn[] = [
    {
      key: "level",
      title: "Level",
      options: LEVELS.map((l) => ({ value: l.slug, label: `${l.name} (${counts[l.slug].toLocaleString()})` })),
    },
    { key: "date", title: "Upload date", options: opts(DATES) },
    { key: "type", title: "Type", options: opts(TYPES) },
    { key: "dur", title: "Duration", options: opts(DURATIONS) },
    { key: "feat", title: "Features", options: opts(filter.special === "inspiration" ? FEATURES.filter((f) => f.slug !== "inspiration") : FEATURES) },
    { key: "sort", title: "Sort by", options: [{ value: "shuffle", label: "Shuffle (for you)" }, ...opts(SORTS)], required: true },
  ];

  return (
    <div className={intro ? "px-4 pb-16 pt-4 sm:px-6" : "pb-16"}>
      {params.q && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="min-w-0 break-words text-xl font-bold sm:text-2xl">Results for “{params.q}”</h1>
          <button
            onClick={() => setParams({ q: "" })}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-hover px-3 text-sm hover:bg-hover-strong"
          >
            <X className="h-4 w-4" /> Clear search
          </button>
        </div>
      )}

      <div className="sticky top-14 z-30 -mx-4 mb-5 bg-bg px-4 py-3 sm:-mx-6 sm:px-6">
        <FilterPanel
          columns={columns}
          values={params}
          onChange={(key, value) => setParams({ [key]: value ?? (key === "sort" ? "shuffle" : null) })}
          onClear={() => setParams({ date: null, type: null, dur: null, feat: null, level: null, topic: null })}
          extra={
            <>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                {!filter.category && !filter.special && (
                  <select
                    aria-label="Topic"
                    value={params.topic ?? ""}
                    onChange={(e) => setParams({ topic: (e.target.value || null) as CategorySlug | null })}
                    className={`${select} w-36 sm:w-auto`}
                  >
                    <option value="">All topics</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {params.sort === "shuffle" ? (
                  <button
                    onClick={reshuffle}
                    aria-label="Shuffle"
                    className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg bg-fg px-2.5 text-sm font-medium text-bg hover:bg-[#d9d9d9] sm:px-3"
                  >
                    <Shuffle className="h-4 w-4" /> <span className="hidden sm:inline">Shuffle</span>
                  </button>
                ) : (
                  <button onClick={() => setParams({ sort: "shuffle" })} className={`${chip(false)} shrink-0`}>
                    {SORTS.find((x) => x.slug === params.sort)?.name} <X className="mb-0.5 ml-1 inline h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </>
          }
        />
      </div>

      {!feed ? (
        <Skeleton />
      ) : feed.length === 0 ? (
        <p className="py-20 text-center text-muted">
          No videos match these filters. Try clearing one.
        </p>
      ) : (
        <>
          <div className={GRID}>
            {feed.slice(0, shown).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
          {shown < feed.length && <div ref={sentinel} className="h-10" />}
        </>
      )}
    </div>
  );
}
