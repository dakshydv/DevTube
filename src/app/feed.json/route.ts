import { VIDEOS } from "@/lib/data";
import { LEVELS } from "@/lib/meta";

/**
 * Compact, prerendered list of every video for the shuffled home feed. Rows are arrays to keep the file small;
 * see `FeedRow` in components/RandomFeed.tsx for the column order.
 */
export async function GET() {
  const rows = VIDEOS.map((v) => [
    v.id,
    v.title,
    v.channel,
    v.category,
    LEVELS.findIndex((l) => l.slug === v.level),
    v.points,
    v.views ?? 0,
    v.year ?? 0,
    v.duration ?? 0,
    (v.curated ? 1 : 0) | (v.inspire ? 2 : 0),
    v.course ?? "",
    v.lbScore ?? 0,
    v.lbId ?? "",
    v.hnId ?? "",
    v.comments,
    v.sub,
    v.tags.filter((t) => t !== v.category).join(" "),
  ]);
  return Response.json(rows);
}
