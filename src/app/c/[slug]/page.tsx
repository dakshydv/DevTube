import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import RandomFeed from "@/components/RandomFeed";
import TopicHeader from "@/components/TopicHeader";
import { CATEGORIES, SPECIALS, getCategory, isSpecial } from "@/lib/data";

export function generateStaticParams() {
  return [...CATEGORIES.map((c) => ({ slug: c.slug })), ...SPECIALS.map((s) => ({ slug: s.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const special = SPECIALS.find((s) => s.slug === slug);
  if (special) return { title: special.name, description: special.description };
  const c = getCategory(slug);
  return c ? { title: c.name, description: c.description } : {};
}

/** A topic (or special view like "Long watches"), shown with the same random grid as Home. */
export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;

  if (isSpecial(slug)) {
    const s = SPECIALS.find((x) => x.slug === slug)!;
    return (
      <div className="px-4 pt-6 sm:px-6">
        <header className="mb-6">
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            <ChevronLeft className="h-4 w-4" /> All categories
          </Link>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{s.name}</h1>
          <p className="mt-2 text-sm text-muted">{s.description}</p>
        </header>
        <RandomFeed filter={{ special: slug }} intro={false} />
      </div>
    );
  }

  const cat = getCategory(slug);
  if (!cat) notFound();
  return (
    <div className="px-4 pt-6 sm:px-6">
      <TopicHeader category={cat.slug} />
      <RandomFeed filter={{ category: cat.slug }} intro={false} />
    </div>
  );
}
