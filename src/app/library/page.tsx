import type { Metadata } from "next";
import LibraryClient from "@/components/LibraryClient";
import { VIDEOS, type Video } from "@/lib/data";

export const metadata: Metadata = { title: "My Library" };

export default function LibraryPage() {
  const lookup: Record<string, Video> = Object.fromEntries(VIDEOS.map((v) => [v.id, v]));
  return (
    <div className="px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My library</h1>
      <p className="mb-8 mt-2 text-sm text-muted">Saved in this browser only. There&apos;s no account and nothing is tracked.</p>
      <LibraryClient lookup={lookup} />
    </div>
  );
}
