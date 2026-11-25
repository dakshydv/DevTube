import type { Metadata } from "next";
import PathsBrowser, { type PathSection } from "@/components/PathsBrowser";
import { ALL_PATHS, getVideo, pathRuntime, type CategorySlug, type Level } from "@/lib/data";

export const metadata: Metadata = {
  title: "Learning Paths & Courses",
  description: "Hand-built learning paths and full university courses, from AI and computer science to hardware and engineering.",
};

/** AI and computer science first, hardware and engineering after. */
const SECTIONS: { title: string; description: string; categories: CategorySlug[] }[] = [
  {
    title: "AI, Machine Learning & Math",
    description: "From neural networks you can build yourself to transformers, LLMs and the math underneath.",
    categories: ["ai-ml", "math"],
  },
  {
    title: "Computer Science & Software",
    description: "Programming, algorithms, systems, databases, the web and the craft of building software.",
    categories: ["algorithms", "languages", "web", "tools", "distributed", "databases", "craft", "systems", "performance", "compilers", "security", "networking", "graphics", "careers", "history"],
  },
  {
    title: "Hardware & Electronics",
    description: "How computers really work, from transistors and breadboard CPUs to circuits, PCBs and chips.",
    categories: ["hardware", "electronics", "retro"],
  },
  {
    title: "Robotics, Space & Engineering",
    description: "Control theory, robots, rockets, physics and the engineering of the physical world.",
    categories: ["robotics", "space", "physics", "engineering", "making"],
  },
];

export default function PathsPage() {
  const levels = (ids: string[]) => ids.map((id) => getVideo(id)?.level).filter(Boolean) as Level[];
  const sections: PathSection[] = SECTIONS.map((s) => ({
    title: s.title,
    description: s.description,
    items: ALL_PATHS.filter((p) => s.categories.includes(p.category)).map((path) => ({
      path,
      levels: levels(path.videos),
      runtime: pathRuntime(path.videos),
    })),
  }));
  return (
    <div className="px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">Learning paths</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        <b className="font-medium text-fg">Paths</b> are short playlists hand-built from the best videos across channels,
        starting with something anyone can follow. <b className="font-medium text-fg">Courses</b> are complete lecture
        series in their original order. Each one has a Next button and remembers your progress, and every path ends with
        extras for going further.
      </p>

      <PathsBrowser sections={sections} />
    </div>
  );
}
