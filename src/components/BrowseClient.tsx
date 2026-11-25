"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORY_MAP, SORTS, type CategorySlug, type Level, type SortKey, type Video } from "@/lib/meta";
import VideoGrid, { type GridFilters } from "./VideoGrid";

const LEVEL_VALUES = ["all", "beginner", "intermediate", "advanced"];

/** Browse/search page: all filters live in the URL so results are shareable. */
export default function BrowseClient({ videos }: { videos: Video[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const level = sp.get("level") ?? "all";
  const category = sp.get("category") ?? "all";
  const sort = sp.get("sort") ?? "recommended";
  const filters: GridFilters = {
    q: sp.get("q") ?? "",
    level: (LEVEL_VALUES.includes(level) ? level : "all") as Level | "all",
    category: (category in CATEGORY_MAP ? category : "all") as CategorySlug | "all",
    sort: (SORTS.some((s) => s.slug === sort) ? sort : "recommended") as SortKey,
  };

  const onChange = useCallback(
    (f: GridFilters) => {
      const p = new URLSearchParams();
      if (f.q) p.set("q", f.q);
      if (f.level !== "all") p.set("level", f.level);
      if (f.category !== "all") p.set("category", f.category);
      if (f.sort !== "recommended") p.set("sort", f.sort);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        {filters.q ? <>Results for “{filters.q}”</> : "Browse all videos"}
      </h1>
      {filters.q && (
        <button onClick={() => onChange({ ...filters, q: "" })} className="mb-2 text-sm text-accent hover:underline">
          Clear search
        </button>
      )}
      <VideoGrid videos={videos} filters={filters} onChange={onChange} />
    </>
  );
}
