import { getAllPosts, Post } from "@/lib/notion";
import { PostCard } from "@/components/post-card";
import { FeaturedPost } from "@/components/featured-post";

// ISRの設定 - 10秒間隔で再生成
export const revalidate = 10;

export default async function Home() {
  const posts = await getAllPosts();

  // フィーチャー投稿と通常の投稿を分離
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 注目の記事 */}
        {featuredPost && (
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
            最新の記事
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
