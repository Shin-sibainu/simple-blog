import { notFound } from "next/navigation";
import { posts, tags } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 6;

export function generateStaticParams() {
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page: string };
}) {
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) {
    notFound();
  }

  const tagPosts = posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
  );

  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const currentPosts = tagPosts.slice(start, end);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Posts tagged with &quot;{tag.name}&quot;
          </h1>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-16">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}