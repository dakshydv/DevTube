import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PathPlaylist from "@/components/PathPlaylist";
import VideoCard from "@/components/VideoCard";
import { ALL_PATHS, CATEGORY_MAP, getPath, getVideo, pathExtras, type Video } from "@/lib/data";

export function generateStaticParams() {
  return ALL_PATHS.map((p) => ({ slug: p.slug }));
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
  const slim = (list: Video[]) => list.map((v) => ({ ...v, ytTitle: null }));
  const raw = pathExtras(path);
  const extras = { goodToKnow: slim(raw.goodToKnow), goDeeper: slim(raw.goDeeper) };

  return (
    <div className="mx-auto max-w-[1284px] px-4 py-6 sm:px-6">
      <PathPlaylist path={path} videos={videos} cat={CATEGORY_MAP[path.category]} />
      <Extras
        title="Good to know"
        subtitle="Related videos at the same level: side stories, applications and different angles. Not required, just worth it."
        videos={extras.goodToKnow}
      />
      <Extras
        title="Go deeper"
        subtitle="Harder material on the same subjects, for when you've finished and want more."
        videos={extras.goDeeper}
      />
    </div>
  );
}

function Extras({ title, subtitle, videos }: { title: string; subtitle: string; videos: Video[] }) {
  if (videos.length === 0) return null;
  return (
    <section className="mt-12 border-t border-line pt-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mb-5 mt-1 text-sm text-muted">{subtitle}</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-x-4 gap-y-8">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
