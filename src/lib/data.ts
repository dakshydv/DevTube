import videosJson from "@/data/videos.json";
import pathsJson from "@/data/paths.json";
import { LEVEL_RANK, CATEGORY_MAP, type Video, type LearningPath, type CategorySlug, type Category } from "./meta";

export * from "./meta";

export const VIDEOS = videosJson as Video[];
export const PATHS = pathsJson as LearningPath[];

const VIDEO_MAP = new Map(VIDEOS.map((v) => [v.id, v]));

export function getVideo(id: string): Video | undefined {
  return VIDEO_MAP.get(id);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_MAP[slug as CategorySlug];
}

export function getPath(slug: string): LearningPath | undefined {
  return PATHS.find((p) => p.slug === slug);
}

export function videosInCategory(slug: CategorySlug): Video[] {
  return VIDEOS.filter((v) => v.category === slug || v.tags.includes(slug));
}

export function primaryInCategory(slug: CategorySlug): Video[] {
  return VIDEOS.filter((v) => v.category === slug);
}

export function pathsContaining(id: string): LearningPath[] {
  return PATHS.filter((p) => p.videos.includes(id));
}



/** Score-based "up next" list: same topic, similar or slightly higher level, popular on HN. */
export function relatedVideos(v: Video, limit = 16): Video[] {
  const rank = LEVEL_RANK[v.level];
  const scored = VIDEOS.filter((o) => o.id !== v.id).map((o) => {
    let s = 0;
    if (o.category === v.category) s += 10;
    for (const t of o.tags) if (v.tags.includes(t)) s += 2.5;
    const d = LEVEL_RANK[o.level] - rank;
    s += d === 0 ? 4 : d === 1 ? 3 : d === -1 ? 1.5 : 0;
    if (o.channel && o.channel === v.channel) s += 2;
    if (o.curated) s += 2;
    s += Math.log10((o.points || 50) + 1) * 1.5;
    return { o, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.o);
}

