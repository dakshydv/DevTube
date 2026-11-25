import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUp, ExternalLink, MessageSquare, Route } from "lucide-react";
import LevelBadge from "@/components/LevelBadge";
import VideoCard from "@/components/VideoCard";
import WatchActions from "@/components/WatchActions";
import PathNav from "@/components/PathNav";
import {
  CATEGORY_MAP,
  LEVELS,
  VIDEOS,
  getVideo,
  hnUrl,
  pathsContaining,
  relatedVideos,
  LEVEL_RANK,
  type Video,
} from "@/lib/data";

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps<"/watch/[id]">): Promise<Metadata> {
  const { id } = await params;
  const v = getVideo(id);
  return v ? { title: v.title, description: `${v.channel}: ${CATEGORY_MAP[v.category].name}, ${v.level}` } : {};
}

export default async function WatchPage({ params }: PageProps<"/watch/[id]">) {
  const { id } = await params;
  const video = getVideo(id);
  if (!video) notFound();

  const cat = CATEGORY_MAP[video.category];
  const related = relatedVideos(video, 18);
  const paths = pathsContaining(video.id);
  const pathVideos: Record<string, Video> = {};
  for (const p of paths) for (const pid of p.videos) {
    const pv = getVideo(pid);
    if (pv) pathVideos[pid] = pv;
  }
  const levelUp =
    video.level !== "advanced"
      ? related.find((r) => LEVEL_RANK[r.level] === LEVEL_RANK[video.level] + 1 && r.category === video.category)
      : undefined;
  const levelInfo = LEVELS.find((l) => l.slug === video.level)!;
  const hn = hnUrl(video);

  return (
    <div className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-line">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <h1 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">{video.title}</h1>
        {video.ytTitle && <p className="mt-1 text-sm text-muted">On YouTube: “{video.ytTitle}”</p>}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium">{video.channel}</span>
            <Link
              href={`/c/${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-hover px-3 py-1 text-xs hover:bg-white/15"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
              {cat.name}
            </Link>
            <LevelBadge level={video.level} />
          </div>
          <WatchActions id={video.id} />
        </div>

        <div className="mt-4 rounded-xl bg-elev p-4 text-sm ring-1 ring-line">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {video.points > 0 ? (
              <>
                <span className="inline-flex items-center gap-1">
                  <ArrowUp className="h-4 w-4 text-accent" /> <b>{video.points}</b> points on Hacker News
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> {video.comments} comments
                </span>
                {video.hnYear && <span className="text-muted">Posted {video.hnYear}</span>}
              </>
            ) : (
              <span className="text-muted">Hand-picked beginner classic</span>
            )}
            {hn && (
              <a
                href={hn}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                Read the HN discussion <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-fg hover:underline"
            >
              Open on YouTube <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mt-3 text-muted">
            <b className="text-fg">{levelInfo.name}:</b> {levelInfo.hint.toLowerCase()}.{" "}
            {video.tags.length > 1 && (
              <>
                Also covers{" "}
                {video.tags
                  .filter((t) => t !== video.category)
                  .map((t, i, arr) => (
                    <span key={t}>
                      <Link href={`/c/${t}`} className="text-fg underline decoration-line underline-offset-2 hover:decoration-fg">
                        {CATEGORY_MAP[t].short}
                      </Link>
                      {i < arr.length - 1 ? ", " : "."}
                    </span>
                  ))}
              </>
            )}
          </p>
        </div>

        {paths.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {paths.map((p) => (
              <Link
                key={p.slug}
                href={`/paths/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-hover"
              >
                <Route className="h-3.5 w-3.5 text-accent" /> Part of “{p.name}”
              </Link>
            ))}
          </div>
        )}
      </div>

      <aside className="w-full shrink-0 xl:w-[400px]">
        <Suspense>
          <PathNav currentId={video.id} paths={paths} videos={pathVideos} />
        </Suspense>
        {levelUp && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-muted">Ready to level up?</h3>
            <VideoCard video={levelUp} compact />
          </div>
        )}
        <h3 className="mb-2 text-sm font-semibold text-muted">Up next in {cat.short}</h3>
        <div className="flex flex-col gap-1">
          {related
            .filter((r) => r.id !== levelUp?.id)
            .map((r) => (
              <VideoCard key={r.id} video={r} compact />
            ))}
        </div>
      </aside>
    </div>
  );
}
