/* eslint-disable @typescript-eslint/no-explicit-any */
// https://splitbee.io/blog/notion-as-cms-using-nextjs
// Notionデータ取得用の関数を改善
import { NotionAPI } from "notion-client";
import { getPageImageUrls } from "notion-utils";
import { cache } from "react";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID as string;

const notion = new NotionAPI();

interface NotionBlock {
  value: {
    type: string;
    format?: {
      page_cover?: string;
    };
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  coverImage: string;
  tags: string[];
  featured: boolean;
}

//notion-api-worker and react-notion
export const getAllPosts = cache(async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${NOTION_API_BASE}/table/${NOTION_PAGE_ID}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts = await res.json();

    // 各投稿のページ情報を取得してカバー画像を取得
    const postsWithCover = await Promise.all(
      posts
        .filter((post: any) => post.Public)
        .map(async (post: any) => {
          const pageRes = await fetch(`${NOTION_API_BASE}/page/${post.id}`);
          const page = await pageRes.json();

          // ページの最初のブロックを取得し、その値を確認
          const firstBlock = Object.values(page).find(
            (block): block is NotionBlock => 
              (block as NotionBlock)?.value?.type === "page"
          );

          const coverImage = firstBlock?.value?.format?.page_cover
            ? firstBlock.value.format.page_cover.startsWith("/images")
              ? `https://www.notion.so${firstBlock.value.format.page_cover}`
              : firstBlock.value.format.page_cover
            : "/default-cover.jpg";

          const date = post.Published
            ? new Date(post.Published).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          return {
            id: post.id,
            title: post.Name || "無題",
            slug: post.Slug || `untitled-${post.id}`,
            date,
            author: {
              name: post.Author || "匿名",
              image: post.AuthorImage || "/default-avatar.png",
              bio: post.AuthorBio || "",
            },
            coverImage,
            tags: Array.isArray(post.Tags) ? post.Tags : [],
            description: post.Description || "",
            excerpt: post.Description || "",
            content: "",
            featured: post.Featured || false,
          };
        })
    );

    return postsWithCover.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p: any) => p.slug === slug);

    if (!post || !post.title) return null;

    const res = await fetch(`${NOTION_API_BASE}/page/${post.id}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch post content: ${res.status}`);
    }

    const page = await res.json();

    if (
      !page ||
      typeof page !== "object" ||
      Object.keys(page).length === 0 ||
      !Object.values(page).some(
        (block: any) =>
          block?.value?.type === "page" &&
          block?.value?.properties?.title?.[0]?.[0]
      )
    ) {
      console.error(`Invalid page content for slug ${slug}`);
      return null;
    }

    return {
      ...post,
      content: page,
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
});

// react-notion-x
export const getDatabase = cache(async () => {
  try {
    const recordMap = await notion.getPage(NOTION_PAGE_ID);

    getPageImageUrls(recordMap, {
      mapImageUrl: (url: string, block: any) => {
        if (url.startsWith("/images")) {
          return `https://www.notion.so${url}`;
        }

        if (url.startsWith("https://prod-files-secure")) {
          const encoded = encodeURIComponent(url);
          return `https://www.notion.so/image/${encoded}?table=block&id=${block.id}&cache=v2`;
        }

        return url;
      },
    });

    const block = Object.values(recordMap.block)[0]?.value;

    if (!block) {
      throw new Error("No block data found");
    }

    // アイコンの処理を修正
    let icon;
    if (block?.format?.page_icon) {
      // 絵文字の場合は直接その文字を使用
      if (
        block.format.page_icon.length === 1 ||
        block.format.page_icon.length === 2
      ) {
        icon = block.format.page_icon; // 絵文字をそのまま返す
      } else {
        // 画像URLの場合は変換処理
        icon = `https://www.notion.so/image/${encodeURIComponent(
          block.format.page_icon
        )}?table=block&id=${block.id}&cache=v2`;
      }
    }

    // データベースのプロパティから追加情報を取得
    const properties = block?.properties || {};
    const author = properties.author?.[0]?.[0];
    const site = properties.site?.[0]?.[0];

    const result = {
      icon,
      cover: block?.format?.page_cover
        ? block.format.page_cover.startsWith("/images")
          ? `https://www.notion.so${block.format.page_cover}`
          : block.format.page_cover
        : undefined,
      title: block?.properties?.title?.[0]?.[0] || undefined,
      coverPosition: block?.format?.page_cover_position || 0.5,
      // 追加の情報
      author,
      site,
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch database:", error);
    return {
      icon: undefined,
      cover: undefined,
      title: "Minimalist",
      coverPosition: 0.5,
      author: undefined,
      site: undefined,
    };
  }
});
