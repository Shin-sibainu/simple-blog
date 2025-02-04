"use client";

import { ExtendedRecordMap } from "notion-types";
import { getPageTableOfContents } from "notion-utils";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  recordMap: ExtendedRecordMap;
}

export function TableOfContents({ recordMap }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [toc] = useState(() => {
    const firstPageId = Object.keys(recordMap.block)[0];
    return getPageTableOfContents(
      recordMap.block[firstPageId].value as any,
      recordMap
    );
  });

  useEffect(() => {
    if (toc.length < 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute("data-block-id");
            if (blockId) {
              setActiveId(blockId);
              if (
                !window.location.hash ||
                window.location.hash.slice(1) !== blockId
              ) {
                window.history.replaceState({}, "", `#${blockId}`);
              }
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    // 見出し要素の監視を開始
    const headings = document.querySelectorAll(
      ".notion-h1, .notion-h2, .notion-h3"
    );
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc.length]);

  if (toc.length < 3) return null;

  return (
    <nav className="fixed right-8 top-40 w-64 bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-sm hidden xl:block">
      <h2 className="font-bold mb-4 text-sm">目次</h2>
      <ul className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {toc.map((item) => (
          <li
            key={item.id}
            className="text-sm"
            style={{ paddingLeft: `${item.indentLevel * 12}px` }}
          >
            <a
              href={`#${item.id.replace(/-/g, "")}`}
              className={`block w-full text-left py-1 text-muted-foreground hover:text-foreground transition-colors ${
                activeId === item.id ? "text-foreground font-bold" : ""
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
