import Link from "next/link";
import { tags } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Tags
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {tag.name} ({tag.count})
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}