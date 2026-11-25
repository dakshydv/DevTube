"use client";

import { useState } from "react";
import type { CategorySlug, Video } from "@/lib/meta";
import { useUserState } from "@/lib/store";
import VideoGrid, { type GridFilters } from "./VideoGrid";

export default function CategoryBrowser({ videos, category }: { videos: Video[]; category: CategorySlug }) {
  const { level } = useUserState();
  const [filters, setFilters] = useState<GridFilters | null>(null);
  // Until the viewer touches a filter, default the level tab to their saved level.
  const effective: GridFilters = filters ?? { q: "", level, category, sort: "recommended" };
  return <VideoGrid videos={videos} filters={effective} onChange={setFilters} showCategory={false} />;
}
