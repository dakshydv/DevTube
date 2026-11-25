import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryBrowser from "@/components/CategoryBrowser";
import PathCard from "@/components/PathCard";
import { CATEGORIES, PATHS, getCategory, getVideo, primaryInCategory, videosInCategory, type Level } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const videos = videosInCategory(cat.slug);
  const primary = primaryInCategory(cat.slug).length;
  const paths = PATHS.filter((p) => p.category === cat.slug);
  const pathLevels = (ids: string[]) => ids.map((id) => getVideo(id)?.level).filter(Boolean) as Level[];

  return (
    <div className="px-4 py-8 sm:px-6">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ background: cat.color }} />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{cat.name}</h1>
        </div>
        <p className="mt-2 max-w-3xl text-muted">{cat.description}</p>
        <p className="mt-1 text-sm text-muted">
          {primary} videos mainly about this topic · {videos.length} including related ones
        </p>
      </header>

      {paths.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Not sure where to start? Follow a path</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paths.map((p) => (
              <PathCard key={p.slug} path={p} levels={pathLevels(p.videos)} />
            ))}
          </div>
        </section>
      )}

      <CategoryBrowser videos={videos} category={cat.slug} />
    </div>
  );
}
