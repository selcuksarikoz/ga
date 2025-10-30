"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { GamesTable } from "./games-table";

export default function GamesTableClient({
  games,
  pagination,
  sortBy,
  sortOrder,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onPageChange = (page: number) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(page));
    startTransition(() => router.push(url.pathname + url.search));
  };

  const onSort = (column: string) => {
    const url = new URL(window.location.toString());
    const current = searchParams.get("sortBy");
    const currentOrder = searchParams.get("sortOrder") || "desc";
    let nextOrder = "asc";
    if (current === column) nextOrder = currentOrder === "asc" ? "desc" : "asc";
    url.searchParams.set("sortBy", column);
    url.searchParams.set("sortOrder", nextOrder);
    // reset to first page when sorting changes
    url.searchParams.set("page", "1");
    startTransition(() => router.push(url.pathname + url.search));
  };

  return (
    <GamesTable
      games={games}
      pagination={pagination}
      onSort={onSort}
      onPageChange={onPageChange}
      sortBy={sortBy}
      sortOrder={sortOrder}
      isLoading={isPending}
    />
  );
}
