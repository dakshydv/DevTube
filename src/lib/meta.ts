export type Level = "beginner" | "intermediate" | "advanced";

export type CategorySlug =
  | "ai-ml"
  | "math"
  | "algorithms"
  | "languages"
  | "compilers"
  | "systems"
  | "performance"
  | "databases"
  | "distributed"
  | "web"
  | "security"
  | "hardware"
  | "graphics"
  | "networking"
  | "tools"
  | "craft"
  | "careers"
  | "history"
  | "retro";

export interface Video {
  id: string;
  title: string;
  ytTitle: string | null;
  channel: string;
  category: CategorySlug;
  tags: CategorySlug[];
  level: Level;
  points: number;
  comments: number;
  hnId: string | null;
  hnYear: number | null;
  curated: boolean;
}

export interface LearningPath {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  videos: string[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  color: string;
  group: "Foundations" | "Building Software" | "Under the Hood" | "Beyond Code";
}

export const CATEGORIES: Category[] = [
  { slug: "ai-ml", name: "AI & Machine Learning", short: "AI & ML", color: "#a78bfa", group: "Foundations",
    description: "Neural networks, LLMs, transformers and reinforcement learning, from first principles to research talks." },
  { slug: "math", name: "Math for Programmers", short: "Math", color: "#60a5fa", group: "Foundations",
    description: "Linear algebra, calculus, probability and the beautiful math behind computing, mostly explained visually." },
  { slug: "algorithms", name: "Algorithms & CS Theory", short: "Algorithms", color: "#34d399", group: "Foundations",
    description: "Data structures, complexity, P vs NP, cellular automata and the theory of computation." },
  { slug: "languages", name: "Programming Languages", short: "Languages", color: "#f472b6", group: "Building Software",
    description: "Python, Rust, C++, Clojure, Erlang, Zig, Lisp and more: language design talks and deep dives." },
  { slug: "web", name: "Web Development", short: "Web", color: "#38bdf8", group: "Building Software",
    description: "HTML, CSS, JavaScript, React, browsers, APIs and how the web actually works." },
  { slug: "databases", name: "Databases & Data", short: "Databases", color: "#fbbf24", group: "Building Software",
    description: "SQL, SQLite, Postgres, Datomic, storage engines, and spreadsheets pushed to their limits." },
  { slug: "distributed", name: "Distributed Systems & Scale", short: "Scale", color: "#fb923c", group: "Building Software",
    description: "System design, microservices, consensus, cloud, and hard lessons from scaling real systems." },
  { slug: "craft", name: "Software Design & Craft", short: "Craft", color: "#f87171", group: "Building Software",
    description: "Simplicity, abstraction, testing and the timeless talks on writing good software." },
  { slug: "tools", name: "Developer Tools", short: "Tools", color: "#a3e635", group: "Building Software",
    description: "Shell, git, Vim, Emacs, debuggers, Docker: tools that make you faster every day." },
  { slug: "systems", name: "Operating Systems & Linux", short: "OS & Linux", color: "#2dd4bf", group: "Under the Hood",
    description: "Kernels, Unix, Linux, Windows internals, containers and file systems." },
  { slug: "performance", name: "Performance & Low-Level", short: "Performance", color: "#e879f9", group: "Under the Hood",
    description: "Data-oriented design, CPU caches, SIMD, GPU compute and making code fast." },
  { slug: "compilers", name: "Compilers & Interpreters", short: "Compilers", color: "#c084fc", group: "Under the Hood",
    description: "Parsers, JITs, LLVM, virtual machines and compilers that compile themselves." },
  { slug: "hardware", name: "Hardware & Electronics", short: "Hardware", color: "#facc15", group: "Under the Hood",
    description: "CPUs from scratch, breadboard computers, chips, semiconductors and electronics." },
  { slug: "networking", name: "Networking & Internet", short: "Networking", color: "#22d3ee", group: "Under the Hood",
    description: "TCP/IP, protocols, fiber, radio and how bits travel across the world." },
  { slug: "security", name: "Security & Hacking", short: "Security", color: "#ef4444", group: "Under the Hood",
    description: "Exploits, reverse engineering, cryptography, hardware hacking and famous security talks." },
  { slug: "graphics", name: "Graphics & Game Dev", short: "Graphics & Games", color: "#4ade80", group: "Under the Hood",
    description: "Rendering, shaders, ray tracing, game engines, and how classic games were built." },
  { slug: "retro", name: "Retro Computing & Reverse Engineering", short: "Retro", color: "#fdba74", group: "Beyond Code",
    description: "Vintage machines, restorations, emulation, and reverse-engineering old games and hardware." },
  { slug: "history", name: "Computing History & Legends", short: "History", color: "#d6d3d1", group: "Beyond Code",
    description: "Documentaries, oral histories, and talks by the people who built computing." },
  { slug: "careers", name: "Startups, Careers & Learning", short: "Careers", color: "#93c5fd", group: "Beyond Code",
    description: "Startup advice, how to speak, how to learn, and building a life in tech." },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<CategorySlug, Category>;

export const LEVELS: { slug: Level; name: string; hint: string }[] = [
  { slug: "beginner", name: "Beginner", hint: "No background needed" },
  { slug: "intermediate", name: "Intermediate", hint: "Some programming experience" },
  { slug: "advanced", name: "Advanced", hint: "Deep dives that assume expertise" },
];

export const LEVEL_RANK: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 };

export function thumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

export function hnUrl(v: Video): string | null {
  return v.hnId ? `https://news.ycombinator.com/item?id=${v.hnId}` : null;
}

export type SortKey = "recommended" | "top" | "discussed" | "newest" | "oldest";

export const SORTS: { slug: SortKey; name: string }[] = [
  { slug: "recommended", name: "Recommended" },
  { slug: "top", name: "Most upvoted on HN" },
  { slug: "discussed", name: "Most discussed" },
  { slug: "newest", name: "Recently posted" },
  { slug: "oldest", name: "Oldest posts" },
];

export function sortVideos(list: Video[], sort: SortKey): Video[] {
  const arr = [...list];
  switch (sort) {
    case "top":
      return arr.sort((a, b) => b.points - a.points);
    case "discussed":
      return arr.sort((a, b) => b.comments - a.comments);
    case "newest":
      return arr.sort((a, b) => (b.hnYear ?? 0) - (a.hnYear ?? 0) || b.points - a.points);
    case "oldest":
      return arr.sort((a, b) => (a.hnYear ?? 9999) - (b.hnYear ?? 9999) || b.points - a.points);
    default:
      // Easiest first, then editor picks, then HN popularity — so newcomers never land on a wall of expert talks.
      return arr.sort(
        (a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || Number(b.curated) - Number(a.curated) || b.points - a.points,
      );
  }
}
