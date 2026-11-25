"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { ArrowLeft, Menu, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import LevelPicker from "./LevelPicker";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-1 pl-2 pr-3" aria-label="DevTube home">
      <span className="text-[20px] font-bold tracking-[-0.06em]">DevTube</span>
    </Link>
  );
}

export default function AppShell({ children, counts }: { children: ReactNode; counts: Record<string, number> }) {
  const [drawer, setDrawer] = useState(false); // overlay sidebar below lg
  const [searching, setSearching] = useState(false); // mobile: search takes over the header

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 bg-bg px-4">
        {searching ? (
          <div className="flex w-full items-center gap-2 sm:hidden">
            <button aria-label="Back" className="rounded-full p-2 hover:bg-hover" onClick={() => setSearching(false)}>
              <ArrowLeft className="h-6 w-6" />
            </button>
            <SearchBox autoFocus onDone={() => setSearching(false)} />
          </div>
        ) : null}
        <div className={`flex shrink-0 items-center ${searching ? "max-sm:hidden" : ""}`}>
          <button className="rounded-full p-2 hover:bg-hover lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <Logo />
        </div>
        <div className="hidden max-w-[732px] flex-1 items-center justify-center sm:flex">
          <SearchBox />
        </div>
        <div className={`flex shrink-0 items-center gap-2 ${searching ? "max-sm:hidden" : ""}`}>
          <button className="rounded-full p-2 hover:bg-hover sm:hidden" aria-label="Search" onClick={() => setSearching(true)}>
            <Search className="h-6 w-6" />
          </button>
          <div className="hidden md:block">
            <LevelPicker />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="no-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto lg:block">
          <Suspense>
            <Sidebar counts={counts} />
          </Suspense>
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
            <div className="no-scrollbar absolute inset-y-0 left-0 w-60 overflow-y-auto bg-bg">
              <div className="flex h-14 items-center px-4">
                <button className="rounded-full p-2 hover:bg-hover" aria-label="Close guide" onClick={() => setDrawer(false)}>
                  <Menu className="h-6 w-6" />
                </button>
                <Logo />
              </div>
              <div className="px-5 pb-2 md:hidden">
                <LevelPicker />
              </div>
              <Suspense>
                <Sidebar counts={counts} onNavigate={() => setDrawer(false)} />
              </Suspense>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function SearchBox({ autoFocus = false, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
        onDone?.();
      }}
      className="flex h-10 w-full max-w-[640px] items-center"
    >
      <div className="flex h-full min-w-0 flex-1 items-center rounded-l-full border border-line bg-[#121212] pl-4 focus-within:ml-0 focus-within:border-[#1c62b9]">
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="h-full min-w-0 flex-1 bg-transparent pr-2 text-base outline-none placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        aria-label="Search"
        title="Search"
        className="flex h-full w-16 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-line bg-hover hover:bg-hover-strong"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
