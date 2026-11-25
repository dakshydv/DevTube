"use client";

import { useMemo, useState } from "react";
import { LEVEL_RANK, type Category, type Level, type Video } from "@/lib/meta";
import ChipBar, { type Chip } from "./ChipBar";
import VideoCard from "./VideoCard";

/** Right-hand "up next" column with YouTube-style filter chips. */
export default function UpNext({ related, level, cat }: { related: Video[]; level: Level; cat: Category }) {
  const [chip, setChip] = useState("all");
  const rank = LEVEL_RANK[level];

  const groups = useMemo(
    () => ({
      all: related,
      topic: related.filter((r) => r.category === cat.slug),
      same: related.filter((r) => r.level === level),
      up: related.filter((r) => LEVEL_RANK[r.level] === rank + 1),
    }),
    [related, cat.slug, level, rank],
  );

  const chips: Chip[] = [
    { key: "all", label: "All" },
    { key: "topic", label: `From ${cat.short}` },
    { key: "same", label: "Same level" },
    { key: "up", label: "Level up" },
  ].filter((c) => groups[c.key as keyof typeof groups].length > 0);

  const list = groups[chip as keyof typeof groups];

  return (
    <div>
      <ChipBar chips={chips} active={chip} onSelect={setChip} className="mb-3" />
      <div className="flex flex-col gap-2">
        {list.map((r) => (
          <VideoCard key={r.id} video={r} compact />
        ))}
      </div>
    </div>
  );
}
