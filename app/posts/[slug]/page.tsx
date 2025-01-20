import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="relative h-[60vh] w-full rounded-lg overflow-hidden shadow-md">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-serif font-bold text-foreground">{post.title}</h1>
          <div className="mt-4 flex items-center space-x-4">
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(post.date)}
              </p>
            </div>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert mt-8 max-w-none">
          {post.content}
        </div>
      </div>
    </div>
  );
}