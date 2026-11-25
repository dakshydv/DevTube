"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Route, Compass, Library } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/meta";

const MAIN = [
  { href: "/", label: "Home", icon: Home },
  { href: "/paths", label: "Learning Paths", icon: Route },
  { href: "/browse", label: "Browse All", icon: Compass },
  { href: "/library", label: "My Library", icon: Library },
];

const GROUPS: Category["group"][] = ["Foundations", "Building Software", "Under the Hood", "Beyond Code"];

export default function Sidebar({ counts, onNavigate }: { counts: Record<string, number>; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3 py-4 text-sm">
      {MAIN.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${active ? "bg-hover font-medium text-white" : "text-fg/85 hover:bg-hover"}`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
      {GROUPS.map((g) => (
        <div key={g} className="mt-4">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{g}</div>
          {CATEGORIES.filter((c) => c.group === g).map((c) => {
            const href = `/c/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ${active ? "bg-hover font-medium text-white" : "text-fg/80 hover:bg-hover"}`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 truncate">{c.short}</span>
                <span className="text-[11px] text-muted">{counts[c.slug] ?? 0}</span>
              </Link>
            );
          })}
        </div>
      ))}
      <p className="mt-6 px-3 text-[11px] leading-relaxed text-muted">
        Videos the Hacker News community upvoted from 2007 to 2026, plus hand-picked beginner classics. All videos play from
        YouTube.
      </p>
    </nav>
  );
}
