import type { Metadata } from "next";
import Link from "next/link";
import Shelf from "@/components/Shelf";
import CategoryGrid from "@/components/CategoryGrid";
import { SPECIALS, VIDEOS, popularity, sortVideos, type Video } from "@/lib/data";

export const metadata: Metadata = {
  title: "Categories",
  description: "Every topic and sub-topic in DevTube, plus beginner classics, inspiration and the most-loved talks.",
};

// Cards don't need the original YouTube title; dropping it keeps the page payload smaller.
const slim = (list: Video[]) => list.map((v) => ({ ...v, ytTitle: null }));

export default function CategoriesPage() {
  const startHere = sortVideos(
    VIDEOS.filter((v) => v.curated && v.level === "beginner"),
    "recommended",
  );
  const mostLoved = sortVideos(VIDEOS.filter((v) => v.points > 0 && !v.inspire), "top").slice(0, 60);
  const inspiration = VIDEOS.filter((v) => v.inspire).sort((a, b) => popularity(b) - popularity(a));

  return (
    <div className="pb-16">
      <section className="px-4 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
          <Link href="/" className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-lg bg-hover px-3 text-sm font-medium hover:bg-hover-strong">
            All videos
          </Link>
          {SPECIALS.map((s) => (
            <Link
              key={s.slug}
              href={`/c/${s.slug}`}
              title={s.description}
              className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-lg bg-hover px-3 text-sm font-medium hover:bg-hover-strong"
            >
              {s.name}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <CategoryGrid />
        </div>
      </section>

      <div className="mt-10">
        <Shelf
          title="Start here"
          subtitle="Beginner-friendly classics. No background needed."
          videos={slim(startHere)}
          adapt={false}
          limit={20}
        />
        <Shelf
          title="Watch the future get built"
          subtitle="Rocket landings, Mars rovers, robots and impossible machines. Not lessons, just inspiration."
          href="/c/inspiration"
          videos={slim(inspiration)}
          adapt={false}
          limit={24}
        />
        <Shelf
          title="Most loved on Hacker News"
          subtitle="The highest-voted tech videos of the last 20 years"
          href="/?sort=top"
          videos={slim(mostLoved)}
          limit={20}
        />
      </div>
    </div>
  );
}
