import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDatabase } from "@/lib/notion";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

// メタデータを動的に生成する関数
async function generateMetadata(): Promise<Metadata> {
  const dbInfo = await getDatabase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const title = dbInfo.title || "Classic";
  const description = "A classic blog template built with Next.js and Notion";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description,
      type: "website",
      siteName: title,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${title} Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: dbInfo.author ? `@${dbInfo.author}` : undefined,
      site: dbInfo.site ? `@${dbInfo.site}` : undefined,
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

// メタデータを動的に生成
export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className}`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
