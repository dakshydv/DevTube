"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Menu, Search, X, Play } from "lucide-react";
import Sidebar from "./Sidebar";
import LevelPicker from "./LevelPicker";

export default function AppShell({ children, counts }: { children: ReactNode; counts: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur">
        <button
          className="rounded-full p-2 hover:bg-hover lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold tracking-tight">
          <span className="flex h-7 w-9 items-center justify-center rounded-lg bg-accent">
            <Play className="h-4 w-4 fill-white text-white" />
          </span>
          <span className="text-lg">
            Dev<span className="text-accent">Tube</span>
          </span>
        </Link>
        <div className="mx-auto w-full max-w-xl">
          <SearchBox />
        </div>
        <div className="hidden shrink-0 md:block">
          <LevelPicker compact />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="no-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line lg:block">
          <Suspense>
            <Sidebar counts={counts} />
          </Suspense>
        </aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="no-scrollbar absolute inset-y-0 left-0 w-72 overflow-y-auto bg-bg">
              <div className="flex h-14 items-center justify-between px-4">
                <span className="font-semibold">Menu</span>
                <button className="rounded-full p-2 hover:bg-hover" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 md:hidden">
                <LevelPicker />
              </div>
              <Suspense>
                <Sidebar counts={counts} onNavigate={() => setOpen(false)} />
              </Suspense>
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/browse?q=${encodeURIComponent(query)}` : "/browse");
      }}
      className="flex w-full items-center overflow-hidden rounded-full border border-line bg-elev focus-within:border-accent/60"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search talks, topics, speakers…"
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted"
      />
      <button type="submit" aria-label="Search" className="border-l border-line px-4 py-2 hover:bg-hover">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
