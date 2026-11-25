import Link from "next/link";
import Shelf from "@/components/Shelf";
import PathCard from "@/components/PathCard";
import LevelOnboarding from "@/components/LevelOnboarding";
import { CATEGORIES, PATHS, VIDEOS, getVideo, primaryInCategory, sortVideos, type Level } from "@/lib/data";

export default function Home() {
  const startHere = sortVideos(
    VIDEOS.filter((v) => v.curated && v.level === "beginner"),
    "recommended",
  );
  const mostLoved = sortVideos(VIDEOS.filter((v) => v.points > 0), "top").slice(0, 60);
  const pathLevels = (ids: string[]) => ids.map((id) => getVideo(id)?.level).filter(Boolean) as Level[];
  const hnCount = VIDEOS.filter((v) => v.points > 0).length;

  return (
    <div className="pb-16">
      <section className="border-b border-line bg-gradient-to-b from-accent/10 to-transparent px-4 py-10 sm:px-6">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">No algorithm. No distractions.</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            The best tech talks the internet ever made, sorted by topic and level.
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {VIDEOS.length.toLocaleString()} videos on AI/ML, software engineering and computer science.{" "}
            {hnCount.toLocaleString()} of them were upvoted by the Hacker News community (2007–2026), and the rest are
            hand-picked beginner classics. Each one is tagged with a topic and a difficulty level, and the{" "}
            <Link href="/paths" className="text-fg underline decoration-accent underline-offset-4">
              learning paths
            </Link>{" "}
            put them in an order to watch.
          </p>
          <LevelOnboarding />
        </div>
      </section>

      <div className="pt-8">

        <section className="mb-10 px-4 sm:px-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Learning paths</h2>
              <p className="text-sm text-muted">Short playlists in watch order. Start at the top and work down.</p>
            </div>
            <Link href="/paths" className="text-sm text-accent hover:underline">
              All paths
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PATHS.slice(0, 4).map((p) => (
              <PathCard key={p.slug} path={p} levels={pathLevels(p.videos)} />
            ))}
          </div>
        </section>

        <Shelf
          title="Start here"
          subtitle="Beginner-friendly classics. No background needed."
          videos={startHere}
          adapt={false}
          limit={20}
        />
        <Shelf
          title="Most loved on Hacker News"
          subtitle="The highest-voted tech videos of the last 20 years"
          href="/browse?sort=top"
          videos={mostLoved}
          limit={20}
        />

        {CATEGORIES.map((c) => (
          <Shelf
            key={c.slug}
            title={c.name}
            subtitle={c.description}
            href={`/c/${c.slug}`}
            color={c.color}
            videos={sortVideos(primaryInCategory(c.slug), "recommended").slice(0, 40)}
          />
        ))}
      </div>
    </div>
  );
}
