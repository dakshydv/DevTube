"use client";

import { GraduationCap, Hammer, Rocket } from "lucide-react";
import { LEVELS, type Level } from "@/lib/meta";
import { actions, useUserState } from "@/lib/store";

const ICONS = { beginner: GraduationCap, intermediate: Hammer, advanced: Rocket };

export default function LevelOnboarding() {
  const { level } = useUserState();
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm text-muted">
        {level === "all" ? "Pick your level and every shelf below adapts to it:" : "Your level (shelves below adapt to it):"}
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {LEVELS.map((l) => {
          const Icon = ICONS[l.slug];
          const active = level === l.slug;
          return (
            <button
              key={l.slug}
              onClick={() => actions.setLevel(active ? "all" : (l.slug as Level))}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                active ? "border-accent bg-accent/10" : "border-line bg-elev hover:bg-hover"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? "text-accent" : "text-muted"}`} />
              <span>
                <span className="block text-sm font-medium">{l.name}</span>
                <span className="block text-xs text-muted">{l.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
