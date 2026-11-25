"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Library, ListVideo, type LucideIcon } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/meta";

const MAIN: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/paths", label: "Learning Paths", icon: ListVideo },
  { href: "/library", label: "My Library", icon: Library },
];

const GROUPS: Category["group"][] = ["Foundations", "Build the Future", "Building Software", "Under the Hood", "Beyond Code"];

export default function Sidebar({ counts, onNavigate }: { counts: Record<string, number>; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col px-3 pb-6 pt-2 text-sm">
      <div className="border-b border-line pb-3">
        {MAIN.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex h-10 items-center gap-5 rounded-[10px] px-3 ${active ? "bg-hover font-medium" : "hover:bg-hover"}`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.4 : 1.75} />
              {label}
            </Link>
          );
        })}
      </div>
      {GROUPS.map((g) => (
        <div key={g} className="border-b border-line py-3">
          <h3 className="px-3 pb-1 pt-1 text-base font-medium">{g}</h3>
          {CATEGORIES.filter((c) => c.group === g).map((c) => {
            const href = `/c/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                onClick={onNavigate}
                className={`flex h-9 items-center gap-4 rounded-[10px] px-3 ${active ? "bg-hover font-medium" : "hover:bg-hover"}`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 truncate">{c.short}</span>
                <span className="text-xs text-muted">{counts[c.slug] ?? 0}</span>
              </Link>
            );
          })}
        </div>
      ))}
      <p className="px-3 pt-4 text-xs leading-relaxed text-muted">
        The best of Hacker News and Lobsters, plus hand-picked channels and full university courses. All videos play
        from YouTube.
      </p>
    </nav>
  );
}
