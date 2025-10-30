"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GamesTable } from "./games-table";

export default function GamesTableClient({
  games,
  pagination,
  sortBy,
  sortOrder,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = (page: number) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(page));
    router.push(url.pathname + url.search);
  };

  const onSort = (column: string) => {
    // implement sorting via URL (not fully implemented here)
    const url = new URL(window.location.toString());
    url.searchParams.set("sortBy", column);
    router.push(url.pathname + url.search);
  };

  return (
    <GamesTable
      games={games}
      pagination={pagination}
      onSort={onSort}
      onPageChange={onPageChange}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
}
