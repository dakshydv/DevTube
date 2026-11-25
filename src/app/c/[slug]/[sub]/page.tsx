import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RandomFeed from "@/components/RandomFeed";
import TopicHeader from "@/components/TopicHeader";
import { CATEGORIES, getCategory, subName, subcategoriesOf } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => subcategoriesOf(c.slug).map((s) => ({ slug: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]/[sub]">): Promise<Metadata> {
  const { slug, sub } = await params;
  const c = getCategory(slug);
  return c ? { title: `${subName(c.slug, sub)} · ${c.short}` } : {};
}

export default async function SubCategoryPage({ params }: PageProps<"/c/[slug]/[sub]">) {
  const { slug, sub } = await params;
  const cat = getCategory(slug);
  if (!cat || !subcategoriesOf(cat.slug).some((s) => s.slug === sub)) notFound();
  return (
    <div className="px-4 pt-6 sm:px-6">
      <TopicHeader category={cat.slug} sub={sub} />
      <RandomFeed filter={{ category: cat.slug, sub }} intro={false} />
    </div>
  );
}
