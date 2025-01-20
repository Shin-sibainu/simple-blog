"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={createPageURL(1)}>
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">最初のページ</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={createPageURL(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">前のページ</span>
        </Link>
      </Button>
      <span className="text-sm">
        {currentPage} / {totalPages}ページ
      </span>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={createPageURL(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">次のページ</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={createPageURL(totalPages)}>
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">最後のページ</span>
        </Link>
      </Button>
    </div>
  );
}
