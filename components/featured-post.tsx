import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface FeaturedPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    date: string;
    description: string;
    author: {
      name: string;
      image: string;
    };
    coverImage: string;
    tags: string[];
    featured: boolean;
  };
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="group relative rounded-lg border overflow-hidden">
      <div className="aspect-[21/9] relative">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col justify-between space-y-4">
          {post.tags.length > 0 && (
            <div className="mt-0 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            <div className="mt-2 line-clamp-3 text-muted-foreground">
              {post.description}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <time>{formatDate(post.date)}</time>
            </div>
            <Link
              href={`/posts/${post.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              続きを読む →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
