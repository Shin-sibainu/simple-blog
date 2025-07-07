import { getAllPosts } from "@/lib/notion";
import { SearchContent } from "./search-content";

// ISRの設定 - 10秒間隔で再生成
export const revalidate = 10;

export default async function SearchPage() {
  const initialPosts = await getAllPosts();

  return <SearchContent initialPosts={initialPosts} />;
}
