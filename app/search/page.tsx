"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { posts } from "@/lib/data";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Search Posts
          </h1>
          <div className="mt-8 max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No posts found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}