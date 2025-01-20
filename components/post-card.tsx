import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/notion";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-card border-border">
      <CardHeader className="p-0">
        <Link href={`/posts/${post.slug}`} className="relative block">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
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
        <Link href={`/posts/${post.slug}`} className="group/title">
          <h2 className="text-xl font-semibold mb-2 transition-colors group-hover/title:text-primary">
            {post.title}
          </h2>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-6 py-4 mt-auto border-t border-border/50">
        <time className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
      </CardFooter>
    </Card>
  );
}
