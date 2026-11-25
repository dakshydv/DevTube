import type { Metadata } from "next";
import { Suspense } from "react";
import BrowseClient from "@/components/BrowseClient";
import { VIDEOS } from "@/lib/data";

export const metadata: Metadata = { title: "Browse", description: "Search and filter every video by topic, level and popularity." };

export default function BrowsePage() {
  return (
    <div className="px-4 py-8 sm:px-6">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <BrowseClient videos={VIDEOS} />
      </Suspense>
    </div>
  );
}
