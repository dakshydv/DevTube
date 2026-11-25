import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListVideo } from "lucide-react";
import ChannelAvatar from "@/components/ChannelAvatar";
import WatchActions from "@/components/WatchActions";
import PathNav from "@/components/PathNav";
import UpNext from "@/components/UpNext";
import { LevelChip } from "@/components/VideoCard";
import { CATEGORY_MAP, LEVELS, formatDuration, lobstersUrl, shortNumber, VIDEOS, getVideo, hnUrl, pathsContaining, relatedVideos, type Video } from "@/lib/data";

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
  const related = relatedVideos(video, 30).map((v) => ({ ...v, ytTitle: null }));
  const paths = pathsContaining(video.id);
  const pathVideos: Record<string, Video> = {};
  for (const p of paths)
    for (const pid of p.videos) {
      const pv = getVideo(pid);
      if (pv) pathVideos[pid] = { ...pv, ytTitle: null };
    }
  const levelInfo = LEVELS.find((l) => l.slug === video.level)!;
  const hn = hnUrl(video);
  const lb = lobstersUrl(video);
  const otherTags = video.tags.filter((t) => t !== video.category);

  return (
    <div className="mx-auto flex max-w-[1754px] flex-col gap-6 px-4 pb-10 pt-0 sm:px-6 sm:pt-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        <div className="-mx-4 aspect-video overflow-hidden bg-black sm:mx-0 sm:rounded-xl">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <h1 className="mt-3 text-lg font-bold leading-6 sm:text-xl sm:leading-7">{video.title}</h1>

        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <ChannelAvatar name={video.channel} size={40} />
            <div className="min-w-0">
              <p className="truncate text-base font-medium">{video.channel}</p>
              <p className="text-xs text-muted">{cat.name}</p>
            </div>
            <Link
              href={`/c/${cat.slug}`}
              className="ml-3 inline-flex h-9 shrink-0 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg hover:bg-[#d9d9d9]"
            >
              More {cat.short}
            </Link>
          </div>
          <WatchActions id={video.id} hn={hn} comments={video.comments} />
        </div>

        {/* On small screens the path/course playlist goes right under the video, like YouTube's mobile app. */}
        <div className="mt-4 lg:hidden">
          <Suspense>
            <PathNav currentId={video.id} paths={paths} videos={pathVideos} />
          </Suspense>
        </div>

        <div className="mt-3 rounded-xl bg-hover p-3 text-sm leading-5">
          <p className="flex flex-wrap items-center gap-x-2 font-medium">
            {video.points > 0 && (
              <>
                <span>{video.points.toLocaleString()} points on Hacker News</span>
                <span>{video.comments.toLocaleString()} comments</span>
              </>
            )}
            {video.lbScore ? <span>{video.lbScore} points on Lobsters</span> : null}
            {video.views ? <span>{shortNumber(video.views)} views</span> : null}
            {video.curated && <span>Editor&apos;s pick · hand-picked beginner classic</span>}
            {video.inspire && <span>Inspiration · watch the future get built</span>}
            {video.year && <span>{video.year}</span>}
            <span className="ml-1 flex flex-wrap gap-x-2 text-link">
              <Link href={`/c/${cat.slug}`}>#{cat.short.replace(/[^\w]/g, "")}</Link>
              {otherTags.map((t) => (
                <Link key={t} href={`/c/${t}`}>
                  #{CATEGORY_MAP[t].short.replace(/[^\w]/g, "")}
                </Link>
              ))}
            </span>
          </p>
          {video.ytTitle && <p className="mt-2">{video.ytTitle}</p>}
          <p className="mt-2 flex flex-wrap items-center gap-2">
            <LevelChip level={video.level} />
            <span>{levelInfo.hint}.</span>
            {video.duration ? <span className="text-muted">Length {formatDuration(video.duration)}</span> : null}
          </p>
          {video.course && <p className="mt-2">From the course “{video.course}”.</p>}
          {hn && (
            <p className="mt-2">
              Read what Hacker News thought:{" "}
              <a href={hn} target="_blank" rel="noreferrer" className="text-link">
                {hn.replace("https://", "")}
              </a>
            </p>
          )}
          {lb && (
            <p className="mt-2">
              Discussion on Lobsters:{" "}
              <a href={lb} target="_blank" rel="noreferrer" className="text-link">
                {lb.replace("https://", "")}
              </a>
            </p>
          )}
          {paths.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {paths.map((p) => (
                <Link
                  key={p.slug}
                  href={`/paths/${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-hover-strong px-3 py-1.5 font-medium hover:bg-[#4f4f4f]"
                >
                  <ListVideo className="h-4 w-4" /> Part of “{p.name}”
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="w-full shrink-0 lg:w-[402px]">
        <div className="hidden lg:block">
          <Suspense>
            <PathNav currentId={video.id} paths={paths} videos={pathVideos} />
          </Suspense>
        </div>
        <UpNext related={related} level={video.level} cat={cat} />
      </aside>
    </div>
  );
}
