import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PathPlaylist from "@/components/PathPlaylist";
import { CATEGORY_MAP, PATHS, getPath, getVideo, type Video } from "@/lib/data";

export function generateStaticParams() {
  return PATHS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/paths/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPath(slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function PathPage({ params }: PageProps<"/paths/[slug]">) {
  const { slug } = await params;
  const path = getPath(slug);
  if (!path) notFound();
  const videos = path.videos.map((id) => getVideo(id)).filter(Boolean) as Video[];
  const cat = CATEGORY_MAP[path.category];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/paths" className="text-sm text-muted hover:text-fg">
        ← All learning paths
      </Link>
      <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
        <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
        <Link href={`/c/${cat.slug}`} className="hover:underline">
          {cat.name}
        </Link>
      </div>
      <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{path.name}</h1>
      <p className="mb-6 mt-2 text-muted">{path.description}</p>
      <PathPlaylist path={path} videos={videos} />
    </div>
  );
}
