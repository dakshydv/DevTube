"use client";

import { ChevronDown, GraduationCap } from "lucide-react";
import { LEVELS, type Level } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";

const OPTIONS: { slug: Level | "all"; name: string }[] = [{ slug: "all", name: "All levels" }, ...LEVELS];

/** Header pill (styled like YouTube's "Create" button) that sets the viewer's level. */
export default function LevelPicker() {
  const { level } = useUserState();
  return (
    <label
      className="relative flex h-9 cursor-pointer items-center gap-2 rounded-full bg-hover pl-3 pr-3 text-sm font-medium hover:bg-hover-strong"
      title="Your level: recommendations adapt to it"
    >
      <GraduationCap className="h-5 w-5 shrink-0" />
      <span className="whitespace-nowrap">{level === "all" ? "Set my level" : OPTIONS.find((o) => o.slug === level)?.name}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      <select
        value={level}
        onChange={(e) => actions.setLevel(e.target.value as Level | "all")}
        aria-label="My level"
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {OPTIONS.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
