import Link from "next/link";
import { CATEGORIES, VIDEOS, subcategoriesOf } from "@/lib/data";

/** The big topic boxes on the Categories page: each topic with its sub-topics and video counts. */
export default function CategoryGrid() {
  const cards = CATEGORIES.map((c) => {
    const own = VIDEOS.filter((v) => v.category === c.slug);
    const subs = subcategoriesOf(c.slug)
      .map((s) => ({ ...s, count: own.filter((v) => v.sub === s.slug).length }))
      .filter((s) => s.count > 0)
      // biggest first, with the "More …" bucket always last
      .sort((a, b) => Number(a.slug.endsWith("-more")) - Number(b.slug.endsWith("-more")) || b.count - a.count);
    return { c, total: own.length, subs };
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {cards.map(({ c, total, subs }) => (
        <section key={c.slug} className="rounded-xl bg-elev p-4">
          <Link href={`/c/${c.slug}`} className="group mb-2 flex items-start justify-between gap-3">
            <h2 className="flex items-start gap-2 text-base font-bold leading-snug group-hover:underline">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
              {c.name}
            </h2>
            <span className="mt-0.5 text-xs text-muted">{total}</span>
          </Link>
          <ul className="flex flex-col">
            {subs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/c/${c.slug}/${s.slug}`}
                  className="-mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-1 text-sm text-fg/85 hover:bg-hover hover:text-fg"
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-muted">{s.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
