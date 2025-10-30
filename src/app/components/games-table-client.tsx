"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { GamesTable } from "./games-table";
import { deleteGameAction } from "@/app/actions/game.actions";
import { toast } from "sonner";

export default function GamesTableClient({
  games,
  pagination,
  sortBy,
  sortOrder,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Next.js 15+ safe: build URL from pathname and searchParams
  const pathname = usePathname();
  const getUrlWithParams = (params: URLSearchParams) =>
    `${pathname}?${params.toString()}`;

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(page));
    startTransition(() => router.push(getUrlWithParams(params)));
  };

  const onDeleteGame = async (id: string) => {
    await deleteGameAction(id);
    toast.success("Game deleted successfully");
    // keep current page after delete
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    startTransition(() => router.push(getUrlWithParams(params)));
  };

  const onSort = (column: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const current = params.get("sortBy");
    const currentOrder = params.get("sortOrder") || "desc";
    let nextOrder = "asc";
    if (current === column) nextOrder = currentOrder === "asc" ? "desc" : "asc";
    params.set("sortBy", column);
    params.set("sortOrder", nextOrder);
    // reset to first page when sorting changes
    params.set("page", "1");
    startTransition(() => router.push(getUrlWithParams(params)));
  };

  return (
    <GamesTable
      games={games}
      pagination={pagination}
      onSort={onSort}
      onPageChange={onPageChange}
      onDeleteGame={onDeleteGame}
      sortBy={sortBy}
      sortOrder={sortOrder}
      isLoading={isPending}
    />
  );
}
