import type { Level } from "@/lib/meta";

const STYLES: Record<Level, string> = {
  beginner: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  intermediate: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  advanced: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

const LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LevelBadge({ level, className = "" }: { level: Level; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${STYLES[level]} ${className}`}
    >
      {LABEL[level]}
    </span>
  );
}
