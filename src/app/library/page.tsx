import type { Metadata } from "next";
import LibraryClient from "@/components/LibraryClient";
import { VIDEOS, type Video } from "@/lib/data";

export const metadata: Metadata = { title: "My Library" };

export default function LibraryPage() {
  const lookup: Record<string, Video> = Object.fromEntries(VIDEOS.map((v) => [v.id, v]));
  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-10 flex items-center gap-4">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 text-3xl font-bold text-white sm:h-28 sm:w-28 sm:text-5xl">
          Y
        </span>
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">You</h1>
          <p className="mt-1 text-sm text-muted">Saved in this browser only. There&apos;s no account and nothing is tracked.</p>
        </div>
      </div>
      <LibraryClient lookup={lookup} />
    </div>
  );
}
