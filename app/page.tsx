import { getAllPosts, Post } from "@/lib/notion";
import { PostCard } from "@/components/post-card";
import { FeaturedPost } from "@/components/featured-post";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const posts = await getAllPosts();

  // フィーチャー投稿と通常の投稿を分離
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const currentPosts = regularPosts.slice(start, end);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 注目の記事 - 最初のページのみ表示 */}
        {currentPage === 1 && featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-foreground">
              注目の記事
            </h2>
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* 最新の記事 */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-foreground">
            {currentPage === 1 ? "最新の記事" : "すべての記事"}
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
