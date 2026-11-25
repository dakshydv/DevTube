import videosJson from "@/data/videos.json";
import pathsJson from "@/data/paths.json";
import { LEVEL_RANK, CATEGORY_MAP, popularity, type Video, type LearningPath, type CategorySlug, type Category } from "./meta";

export * from "./meta";

export const VIDEOS = videosJson as unknown as Video[];
export const ALL_PATHS = pathsJson as unknown as LearningPath[];
/** Hand-built learning paths. */
export const PATHS = ALL_PATHS.filter((p) => p.kind === "path");
/** Full lecture series, in their original order. */
export const COURSES = ALL_PATHS.filter((p) => p.kind === "course");

const VIDEO_MAP = new Map(VIDEOS.map((v) => [v.id, v]));

export function getVideo(id: string): Video | undefined {
  return VIDEO_MAP.get(id);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_MAP[slug as CategorySlug];
}

export function getPath(slug: string): LearningPath | undefined {
  return ALL_PATHS.find((p) => p.slug === slug);
}

export function videosInCategory(slug: CategorySlug): Video[] {
  return VIDEOS.filter((v) => v.category === slug || v.tags.includes(slug));
}

export function primaryInCategory(slug: CategorySlug): Video[] {
  return VIDEOS.filter((v) => v.category === slug);
}

/** Total length of a list of videos, in seconds. */
export function pathRuntime(ids: string[]): number {
  return ids.reduce((t, id) => t + (VIDEO_MAP.get(id)?.duration ?? 0), 0);
}

export function pathsContaining(id: string): LearningPath[] {
  return ALL_PATHS.filter((p) => p.videos.includes(id));
}

/** Score-based "up next" list: same topic, similar or slightly higher level, popular on HN. */
export function relatedVideos(v: Video, limit = 16): Video[] {
  const rank = LEVEL_RANK[v.level];
  const scored = VIDEOS.filter((o) => o.id !== v.id).map((o) => {
    let s = 0;
    if (o.category === v.category) s += 10;
    if (o.sub === v.sub) s += 3;
    for (const t of o.tags) if (v.tags.includes(t)) s += 2.5;
    const d = LEVEL_RANK[o.level] - rank;
    s += d === 0 ? 4 : d === 1 ? 3 : d === -1 ? 1.5 : 0;
    if (o.channel && o.channel === v.channel) s += 2;
    if (o.curated) s += 2;
    if (o.inspire && !v.inspire) s -= 2;
    if (o.course && o.course === v.course) s += 3;
    s += Math.log10(popularity(o) / 10_000 + 2) * 1.5;
    return { o, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.o);
}


const STOP = new Set(
  "the a an and or of to in on for with how what why is are your you it this that from by at as be can do does part lecture explained introduction intro video vs into about make made build building using use new most best one two".split(
    " ",
  ),
);
const words = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w));

/**
 * Extras for a learning path: related videos that aren't in it. "Good to know" stays at the path's level;
 * "Go deeper" is harder material on the same subjects. Relatedness = shared sub-topics, title words and channels.
 */
export function pathExtras(path: LearningPath, limit = 12): { goodToKnow: Video[]; goDeeper: Video[] } {
  const own = path.videos.map(getVideo).filter(Boolean) as Video[];
  const inPath = new Set(path.videos);
  const cats = new Set<CategorySlug>([path.category, ...own.flatMap((v) => [v.category, ...v.tags])]);
  const subs = new Map<string, number>();
  for (const v of own) subs.set(v.sub, (subs.get(v.sub) ?? 0) + 1);
  const vocab = new Map<string, number>();
  for (const v of own) for (const w of new Set(words(v.title))) vocab.set(w, (vocab.get(w) ?? 0) + 1);
  const channels = new Set(own.map((v) => v.channel));
  const avgRank = own.reduce((t, v) => t + LEVEL_RANK[v.level], 0) / Math.max(own.length, 1);

  const scored = VIDEOS.filter(
    (v) => !inPath.has(v.id) && !v.inspire && !v.course && (cats.has(v.category) || v.tags.some((t) => cats.has(t))),
  )
    .map((v) => {
      let s = 0;
      s += (subs.get(v.sub) ?? 0) * 1.2;
      if (v.category === path.category) s += 2;
      let shared = 0;
      for (const w of new Set(words(v.title))) if (vocab.has(w)) shared += Math.min(vocab.get(w)!, 3);
      s += Math.min(shared, 6) * 1.1;
      if (channels.has(v.channel)) s += 1;
      s += Math.log10(popularity(v) / 50_000 + 1) * 0.8;
      return { v, s };
    })
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s);

  const goodToKnow = scored.filter((x) => LEVEL_RANK[x.v.level] <= Math.round(avgRank)).slice(0, limit).map((x) => x.v);
  const used = new Set(goodToKnow.map((v) => v.id));
  const goDeeper = scored
    .filter((x) => !used.has(x.v.id) && LEVEL_RANK[x.v.level] > avgRank)
    .slice(0, limit)
    .map((x) => x.v);
  return { goodToKnow, goDeeper };
}
