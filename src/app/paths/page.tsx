import type { Metadata } from "next";
import PathCard from "@/components/PathCard";
import { PATHS, getVideo, type Level } from "@/lib/data";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Playlists that take you from beginner to advanced, one video at a time.",
};

export default function PathsPage() {
  const pathLevels = (ids: string[]) => ids.map((id) => getVideo(id)?.level).filter(Boolean) as Level[];
  return (
    <div className="px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Learning paths</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Each path is a short playlist in watch order. It starts with something anyone can follow and gets harder as it
        goes. Your progress is saved in this browser.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PATHS.map((p) => (
          <PathCard key={p.slug} path={p} levels={pathLevels(p.videos)} />
        ))}
      </div>
    </div>
  );
}
