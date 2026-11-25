"use client";

import { LEVELS, type Level } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";

const OPTIONS: { slug: Level | "all"; name: string }[] = [{ slug: "all", name: "All levels" }, ...LEVELS];

export default function LevelPicker({ compact = false }: { compact?: boolean }) {
  const { level } = useUserState();
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      {!compact && <span>My level</span>}
      <select
        value={level}
        onChange={(e) => actions.setLevel(e.target.value as Level | "all")}
        className="rounded-full border border-line bg-elev px-3 py-1.5 text-xs text-fg outline-none hover:bg-hover"
        title="Your level: recommendations adapt to it"
      >
        {OPTIONS.map((o) => (
          <option key={o.slug} value={o.slug}>
            {compact && o.slug !== "all" ? `My level: ${o.name}` : o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
