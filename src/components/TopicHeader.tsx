import Link from "next/link";
import { ChevronLeft, ListVideo } from "lucide-react";
import { ALL_PATHS, CATEGORY_MAP, VIDEOS, subcategoriesOf, type CategorySlug } from "@/lib/data";

/** Header for a topic / sub-topic feed: name, description, sub-topic chips and related learning paths. */
export default function TopicHeader({ category, sub }: { category: CategorySlug; sub?: string }) {
  const cat = CATEGORY_MAP[category];
  const own = VIDEOS.filter((v) => v.category === category);
  const allCount = VIDEOS.filter((v) => v.category === category || v.tags.includes(category)).length;
  const subs = subcategoriesOf(category)
    .map((s) => ({ ...s, count: own.filter((v) => v.sub === s.slug).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => Number(a.slug.endsWith("-more")) - Number(b.slug.endsWith("-more")) || b.count - a.count);
  const paths = ALL_PATHS.filter((p) => p.category === category);
  const current = subs.find((s) => s.slug === sub);
  const chip = (active: boolean) =>
    `inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors ${
      active ? "bg-fg text-bg" : "bg-hover hover:bg-hover-strong"
    }`;

  return (
    <header className="mb-6">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ChevronLeft className="h-4 w-4" /> All categories
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: cat.color }} />
        <h1 className="min-w-0 text-xl font-bold sm:text-3xl">
          {current ? (
            <>
              <Link href={`/c/${category}`} className="text-muted hover:text-fg">
                {cat.name}
              </Link>{" "}
              <span className="text-muted">/</span> {current.name}
            </>
          ) : (
            cat.name
          )}
        </h1>
      </div>
      {!current && <p className="mt-2 max-w-3xl text-sm text-muted">{cat.description}</p>}

      <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={`/c/${category}`} className={chip(!sub)}>
          All <span className="font-normal opacity-60">{allCount}</span>
        </Link>
        {subs.map((s) => (
          <Link key={s.slug} href={`/c/${category}/${s.slug}`} className={chip(s.slug === sub)}>
            {s.name} <span className="font-normal opacity-60">{s.count}</span>
          </Link>
        ))}
      </div>

      {paths.length > 0 && (
        <p className="no-scrollbar -mx-4 mt-4 flex items-center gap-x-3 gap-y-1 overflow-x-auto whitespace-nowrap px-4 text-sm text-muted sm:mx-0 sm:flex-wrap sm:px-0">
          <ListVideo className="h-4 w-4 shrink-0" /> Want it in order?
          {paths.map((p) => (
            <Link key={p.slug} href={`/paths/${p.slug}`} className="text-link hover:underline">
              {p.name}
            </Link>
          ))}
        </p>
      )}
    </header>
  );
}
