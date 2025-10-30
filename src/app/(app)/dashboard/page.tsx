import { caller } from "@/trpc/server";
import FiltersClient from "@/app/components/filters-client";
import GamesTableClient from "@/app/components/games-table-client";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DashboardPage({ searchParams }: Props) {
  // read search params for server-side filters/pagination
  const page = Number(searchParams.page ?? 1);
  const limit = Number(searchParams.limit ?? 20);
  const rawSortBy =
    typeof searchParams.sortBy === "string" ? searchParams.sortBy : undefined;
  const sortBy = (
    ["title", "releaseYear", "price", "score", "createdAt"] as const
  ).includes(rawSortBy as any)
    ? (rawSortBy as "title" | "releaseYear" | "price" | "score" | "createdAt")
    : undefined;
  const sortOrder =
    typeof searchParams.sortOrder === "string"
      ? (searchParams.sortOrder as "asc" | "desc")
      : undefined;

  const developerId =
    typeof searchParams.developerId === "string"
      ? searchParams.developerId
      : undefined;
  const releaseYear = searchParams.releaseYear
    ? Number(searchParams.releaseYear)
    : undefined;
  const priceMin = searchParams.priceMin
    ? Number(searchParams.priceMin)
    : undefined;
  const priceMax = searchParams.priceMax
    ? Number(searchParams.priceMax)
    : undefined;

  // fetch developers for filter options
  const developers = await caller.developers.list();

  // fetch games list from server via tRPC
  const res = await caller.game.list({
    page,
    limit,
    developerId,
    releaseYear,
    priceMin,
    priceMax,
    sortBy,
    sortOrder,
  });

  // server-side console log for debugging
  // eslint-disable-next-line no-console
  console.log("[dashboard] games.list result:", res);

  const games = res?.games ?? [];

  // Build a minimal filters object for the FilterPanel
  const filters = {
    search: "",
    genre: "",
    developer: developerId ?? "",
    yearMin: releaseYear ?? 2010,
    yearMax: releaseYear ?? new Date().getFullYear(),
    priceMin: priceMin ?? 0,
    priceMax: priceMax ?? 100,
    scoreMin: 0,
    scoreMax: 100,
    platform: "",
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard — Games</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <FiltersClient genres={[]} developers={developers} platforms={[]} />
        </div>
        <div className="col-span-3">
          <GamesTableClient
            games={games}
            pagination={res.pagination}
            sortBy={sortBy ?? "title"}
            sortOrder={sortOrder ?? "asc"}
          />
        </div>
      </div>
    </div>
  );
}
