import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getAllPosts } from "@/lib/notion";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const NotionContent = dynamic(
  () => import("@/components/notion/NotionContent"),
  { ssr: false }
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "お探しの記事は見つかりませんでした。",
    };
  }

  const title = post.title || "無題";
  const description = post.description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 max-w-4xl">
        <div className="px-4">
          <div className="relative h-[32vh] w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.coverImage}
              fill
              alt={post.title}
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground">
              {post.title}
            </h1>
            <div className="mt-4">
              <time className="text-sm text-muted-foreground">
                {formatDate(post.date)}
              </time>
            </div>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert mt-8 max-w-none">
          <NotionContent content={post.content} />
        </div>
      </div>
    </div>
  );
}
