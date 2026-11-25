import subcategoriesJson from "@/data/subcategories.json";

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
  | "retro"
  | "robotics"
  | "electronics"
  | "space"
  | "physics"
  | "engineering"
  | "making";

export type Source = "hn" | "lobsters" | "channel" | "course" | "curated";

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
  /** Year it was posted to HN/Lobsters, or (approximately) uploaded for curated videos. */
  year: number | null;
  /** Length in seconds, read from the public YouTube page when the dataset was built. */
  duration: number | null;
  /** Hand-picked beginner classic. */
  curated: boolean;
  /** Where the video came from: an HN/Lobsters discussion, a curated channel, or a full course playlist. */
  source: Source;
  /** YouTube view count when the dataset was built (curated channels and courses only). */
  views: number | null;
  lbScore?: number;
  lbId?: string | null;
  /** Spectacle rather than a lesson (launches, robot demos, "I built X"). */
  inspire?: boolean;
  /** Name of the course playlist this video belongs to. */
  course?: string;
  /** Sub-topic slug within `category` (see SUBCATEGORIES); "<category>-more" for everything else. */
  sub: string;
}

export interface LearningPath {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  videos: string[];
  /** "path" = hand-built sequence across channels; "course" = a full lecture series in its original order. */
  kind: "path" | "course";
  org?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  color: string;
  group: "Foundations" | "Build the Future" | "Building Software" | "Under the Hood" | "Beyond Code";
}

export const CATEGORIES: Category[] = [
  { slug: "ai-ml", name: "AI & Machine Learning", short: "AI & ML", color: "#a78bfa", group: "Foundations",
    description: "Neural networks, LLMs, transformers and reinforcement learning, from first principles to research talks." },
  { slug: "math", name: "Math for Programmers", short: "Math", color: "#60a5fa", group: "Foundations",
    description: "Linear algebra, calculus, probability and the beautiful math behind computing, mostly explained visually." },
  { slug: "algorithms", name: "Algorithms & CS Theory", short: "Algorithms", color: "#34d399", group: "Foundations",
    description: "Data structures, complexity, P vs NP, cellular automata and the theory of computation." },
  { slug: "robotics", name: "Robotics & Control", short: "Robotics", color: "#f97316", group: "Build the Future",
    description: "Feedback control, PID, Kalman filters, kinematics, SLAM, legged robots and the people building them." },
  { slug: "electronics", name: "Electronics & Embedded", short: "Electronics", color: "#eab308", group: "Build the Future",
    description: "Circuits from first principles, components, soldering, microcontrollers, PCB design and RF." },
  { slug: "space", name: "Space & Aerospace", short: "Space & Aero", color: "#818cf8", group: "Build the Future",
    description: "Rockets, engines, orbits, landers, aircraft and jet engines, and the engineering that gets us off the ground." },
  { slug: "physics", name: "Physics & Energy", short: "Physics & Energy", color: "#06b6d4", group: "Build the Future",
    description: "Electricity, light, quantum mechanics, relativity, nuclear and fusion power, batteries and the grid." },
  { slug: "engineering", name: "Engineering & Manufacturing", short: "Engineering", color: "#94a3b8", group: "Build the Future",
    description: "How things are designed and made: machines, materials, machining, 3D printing, bridges, dams and engines." },
  { slug: "making", name: "Maker Projects", short: "Maker Projects", color: "#fb7185", group: "Build the Future",
    description: "Ambitious builds by brilliant tinkerers: robots, rockets, impossible machines and everything in between." },
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
  { slug: "hardware", name: "Chips & Computer Hardware", short: "Hardware", color: "#facc15", group: "Under the Hood",
    description: "CPUs from scratch, breadboard computers, memory, chip design and how semiconductors are made." },
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

export function lobstersUrl(v: Video): string | null {
  return v.lbId ? `https://lobste.rs/s/${v.lbId}` : null;
}

/** One popularity scale across sources: ~100 HN points is treated like ~1M YouTube views. */
export function popularity(v: Video): number {
  return Math.max(v.points * 10_000, (v.lbScore ?? 0) * 25_000, v.views ?? 0);
}

export type SortKey = "recommended" | "popular" | "top" | "discussed" | "newest" | "oldest" | "shortest" | "longest";

export const SORTS: { slug: SortKey; name: string }[] = [
  { slug: "recommended", name: "Best first" },
  { slug: "popular", name: "Most popular" },
  { slug: "top", name: "Most upvoted on HN" },
  { slug: "discussed", name: "Most discussed" },
  { slug: "newest", name: "Newest first" },
  { slug: "oldest", name: "Oldest first" },
  { slug: "shortest", name: "Shortest first" },
  { slug: "longest", name: "Longest first" },
];

export function sortVideos(list: Video[], sort: SortKey): Video[] {
  const arr = [...list];
  switch (sort) {
    case "popular":
      return arr.sort((a, b) => popularity(b) - popularity(a));
    case "top":
      return arr.sort((a, b) => b.points - a.points || popularity(b) - popularity(a));
    case "discussed":
      return arr.sort((a, b) => b.comments - a.comments);
    case "newest":
      return arr.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || popularity(b) - popularity(a));
    case "oldest":
      return arr.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || popularity(b) - popularity(a));
    case "shortest":
      return arr.sort((a, b) => (a.duration ?? 1e9) - (b.duration ?? 1e9));
    case "longest":
      return arr.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
    default:
      // Easiest first, then editor picks, then lessons before spectacle, then popularity — so newcomers never land
      // on a wall of expert talks.
      return arr.sort(
        (a, b) =>
          LEVEL_RANK[a.level] - LEVEL_RANK[b.level] ||
          Number(b.curated) - Number(a.curated) ||
          Number(!!a.inspire) - Number(!!b.inspire) ||
          popularity(b) - popularity(a),
      );
  }
}

/** Reorder a list for the viewer's level: their level first, one step up next, easier after, far-above hidden. */
export function personalize(list: Video[], level: Level | "all"): Video[] {
  if (level === "all") return list;
  const r = LEVEL_RANK[level];
  const weight = (v: Video) => {
    const d = LEVEL_RANK[v.level] - r;
    return d === 0 ? 0 : d === 1 ? 1 : d < 0 ? 2 : 3;
  };
  return list
    .filter((v) => LEVEL_RANK[v.level] - r <= 1)
    .map((v, i) => ({ v, i }))
    .sort((a, b) => weight(a.v) - weight(b.v) || a.i - b.i)
    .map((x) => x.v);
}

/** Stable colour + initials for a channel "avatar" (we don't have real channel images without the API). */
export function channelAvatar(name: string): { bg: string; initials: string } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2)).toUpperCase();
  return { bg: `hsl(${h % 360} 45% 38%)`, initials };
}

/** 1120 -> "18:40", 4521 -> "1:15:21" (YouTube's format). */
export function formatDuration(sec: number | null | undefined): string | null {
  if (!sec) return null;
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** Total runtime in words: 12300 -> "3h 25m", 2400 -> "40 min". */
export function formatRuntime(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

export function shortNumber(n: number): string {
  const fmt = (x: number, unit: string) => `${x.toFixed(x >= 10 ? 0 : 1).replace(/\.0$/, "")}${unit}`;
  if (n >= 1e9) return fmt(n / 1e9, "B");
  if (n >= 1e6) return fmt(n / 1e6, "M");
  if (n >= 1e3) return fmt(n / 1e3, "K");
  return String(n);
}

// ---------------------------------------------------------------------------------------------------------------
// Sub-topics

export interface SubCategory {
  slug: string;
  name: string;
}

const SUBS = subcategoriesJson as Record<string, SubCategory[]>;

/** Sub-topics of a category, including the "More …" bucket for everything that doesn't fit a named one. */
export function subcategoriesOf(cat: CategorySlug): SubCategory[] {
  return [...(SUBS[cat] ?? []), { slug: `${cat}-more`, name: `More ${CATEGORY_MAP[cat].short}` }];
}

export function subName(cat: CategorySlug, sub: string): string {
  return subcategoriesOf(cat).find((s) => s.slug === sub)?.name ?? sub;
}

// ---------------------------------------------------------------------------------------------------------------
// Special views shown as chips on the Categories page

export type SpecialSlug = "long" | "short" | "gems" | "inspiration";

export const SPECIALS: { slug: SpecialSlug; name: string; description: string }[] = [
  { slug: "long", name: "Long watches", description: "Lectures, documentaries and deep dives of 40 minutes or more." },
  { slug: "short", name: "Short & sweet", description: "Under 10 minutes: one idea, explained well." },
  { slug: "gems", name: "Hidden gems", description: "Great videos that never went viral." },
  { slug: "inspiration", name: "Inspiration", description: "Rocket landings, Mars rovers, robots and impossible machines." },
];

export function isSpecial(slug: string): slug is SpecialSlug {
  return SPECIALS.some((s) => s.slug === slug);
}

export function matchesSpecial(v: Video, special: SpecialSlug): boolean {
  switch (special) {
    case "long":
      return (v.duration ?? 0) >= 40 * 60;
    case "short":
      return !!v.duration && v.duration < 10 * 60;
    case "inspiration":
      return !!v.inspire;
    case "gems":
      return (
        !v.inspire &&
        ((v.views !== null && v.views > 0 && v.views < 150_000) ||
          (v.points >= 50 && v.points < 110 && !v.views) ||
          (!!v.lbScore && v.lbScore >= 10 && v.lbScore < 30 && v.points === 0))
      );
  }
}

/** What a feed shows: everything, a category, a sub-topic, or a special view. */
export interface FeedFilter {
  category?: CategorySlug;
  sub?: string;
  special?: SpecialSlug;
}

export function matchesFilter(v: Video, f: FeedFilter): boolean {
  if (f.special) return matchesSpecial(v, f.special);
  if (f.category && f.sub) return v.category === f.category && v.sub === f.sub;
  if (f.category) return v.category === f.category || v.tags.includes(f.category);
  return true;
}

// ---------------------------------------------------------------------------------------------------------------
// Filters panel (Upload date / Type / Duration / Features)

export type VideoType = "lecture" | "talk" | "explainer" | "tutorial" | "documentary" | "interview" | "build" | "demo";

export const TYPES: { slug: VideoType; name: string }[] = [
  { slug: "talk", name: "Talk" },
  { slug: "lecture", name: "Lecture" },
  { slug: "explainer", name: "Explainer" },
  { slug: "tutorial", name: "Tutorial" },
  { slug: "documentary", name: "Documentary" },
  { slug: "interview", name: "Interview" },
  { slug: "build", name: "Build & project" },
  { slug: "demo", name: "Demo & showcase" },
];

const rx = (s: string) => new RegExp(`(?<![a-z0-9])(${s})(?![a-z0-9])`, "i");
const T_LECTURE = rx("lecture|lec \\d+|lesson|class \\d+|week \\d+|recitation|cs\\d{2,3}\\w?|6\\.\\d{3,4}|18\\.06|course|bootcamp|seminar");
const T_INTERVIEW = rx("interview\\w*|oral history|conversation|in conversation|podcast|fireside|q&a|ama|talks? with|chat with|meets|ft\\.");
const T_DOC = rx("documentary|the story of|history of|the rise and fall|rise and fall|the making of|behind the|what happened|origins? of|retrospective");
const T_TALK = rx("talk|keynote|conf\\w*|summit|symposium|meetup|workshop|panel|def ?con \\d+|cppcon|strange loop|gophercon|pycon|jsconf|rubyconf|fosdem|gdc|lca|sigplan|icfp|usenix|presentation");
const T_TUTORIAL = rx("tutorial|how to|full course|crash course|learn|beginners?|step[- ]by[- ]step|guide|getting started|setup|set up|walkthrough|in \\d+ minutes|basics|101|code[- ]it[- ]yourself|coding challenge|implement\\w*|from scratch");
const T_BUILD = rx("i built|i made|i designed|i tried|we built|building an?|build an?|making an?|diy|homemade|home-?made|i turned|restor\\w*|repair\\w*");
const T_DEMO = rx("demo|showcase|test flight|first flight|launch\\w*|landing|unveil\\w*|introducing|trailer|in action|hands on|teaser");
const TALK_CHANNELS = rx(
  "strange loop conference|cppcon|goto conferences|defconconference|ndc conferences|jsconf|pycon|fosdem|google techtalks|talks at google|clojuretv|erlang solutions|media\\.ccc\\.de|black hat|usenix|linux\\.conf\\.au|curry on!|code sync|paperswelove|gdc festival of gaming|infoq|confreaks|acm sigplan|meeting cpp|accu conference|lambda world|recurse center|devoxx|london clojurians|zig showtime|rust programming language|oxidize conference|bsdcan|plass?|icfp video|llvm|cmu database group",
);

const typeCache = new WeakMap<Video, VideoType>();

/** Best guess at what kind of video this is, from its title, channel and source. */
export function videoType(v: Video): VideoType {
  const hit = typeCache.get(v);
  if (hit) return hit;
  const t = `${v.title} ${v.course ?? ""}`;
  let type: VideoType;
  if (v.course || T_LECTURE.test(t)) type = "lecture";
  else if (T_INTERVIEW.test(t)) type = "interview";
  else if (T_DOC.test(t)) type = "documentary";
  else if (T_TALK.test(t) || TALK_CHANNELS.test(v.channel)) type = "talk";
  else if (v.inspire || (T_DEMO.test(t) && v.category !== "making")) type = "demo";
  else if (T_BUILD.test(t) || v.category === "making") type = "build";
  else if (T_TUTORIAL.test(t)) type = "tutorial";
  else type = "explainer";
  typeCache.set(v, type);
  return type;
}

export type DateBucket = "recent" | "2020s" | "2010s" | "2000s" | "older";
export const DATES: { slug: DateBucket; name: string }[] = [
  { slug: "recent", name: "Past year" },
  { slug: "2020s", name: "2020s" },
  { slug: "2010s", name: "2010s" },
  { slug: "2000s", name: "2000s" },
  { slug: "older", name: "Before 2000" },
];

export type DurationBucket = "under4" | "4to20" | "20to60" | "over60";
export const DURATIONS: { slug: DurationBucket; name: string }[] = [
  { slug: "under4", name: "Under 4 minutes" },
  { slug: "4to20", name: "4–20 minutes" },
  { slug: "20to60", name: "20–60 minutes" },
  { slug: "over60", name: "Over 1 hour" },
];

export type Feature = "gems" | "picks" | "hn" | "unwatched" | "courses" | "inspiration";
export const FEATURES: { slug: Feature; name: string }[] = [
  { slug: "gems", name: "Hidden gems" },
  { slug: "picks", name: "Editor's picks" },
  { slug: "hn", name: "HN favorites (100+ points)" },
  { slug: "courses", name: "From full courses" },
  { slug: "unwatched", name: "Not watched yet" },
  { slug: "inspiration", name: "Inspiration" },
];

export interface FacetState {
  date?: DateBucket | null;
  type?: VideoType | null;
  dur?: DurationBucket | null;
  feat?: Feature | null;
}

const NOW_YEAR = 2026;

export function matchesFacets(v: Video, f: FacetState, watched?: Set<string>): boolean {
  if (f.date) {
    const y = v.year;
    if (!y) return false;
    if (f.date === "recent" && y < NOW_YEAR - 1) return false;
    if (f.date === "2020s" && (y < 2020 || y > 2029)) return false;
    if (f.date === "2010s" && (y < 2010 || y > 2019)) return false;
    if (f.date === "2000s" && (y < 2000 || y > 2009)) return false;
    if (f.date === "older" && y >= 2000) return false;
  }
  if (f.type && videoType(v) !== f.type) return false;
  if (f.dur) {
    const d = v.duration;
    if (!d) return false;
    if (f.dur === "under4" && d >= 240) return false;
    if (f.dur === "4to20" && (d < 240 || d >= 1200)) return false;
    if (f.dur === "20to60" && (d < 1200 || d >= 3600)) return false;
    if (f.dur === "over60" && d < 3600) return false;
  }
  if (f.feat) {
    if (f.feat === "gems" && !matchesSpecial(v, "gems")) return false;
    if (f.feat === "picks" && !v.curated) return false;
    if (f.feat === "hn" && v.points < 100) return false;
    if (f.feat === "courses" && !v.course) return false;
    if (f.feat === "inspiration" && !v.inspire) return false;
    if (f.feat === "unwatched" && watched?.has(v.id)) return false;
  }
  return true;
}
