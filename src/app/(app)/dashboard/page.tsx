import { caller } from "@/trpc/server";
import FiltersClient from "@/app/components/filters-client";
import GamesTableClient from "@/app/components/games-table-client";
import { Prisma, Genre } from "@prisma/client";
import { ActionButtons } from "@/app/components/action-buttons";

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
  const genre =
    typeof searchParams.genre === "string" ? searchParams.genre : undefined;
  const yearMin = searchParams.yearMin
    ? Number(searchParams.yearMin)
    : undefined;
  const yearMax = searchParams.yearMax
    ? Number(searchParams.yearMax)
    : undefined;
  const scoreMin = searchParams.scoreMin
    ? Number(searchParams.scoreMin)
    : undefined;
  const scoreMax = searchParams.scoreMax
    ? Number(searchParams.scoreMax)
    : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

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
    genre,
    yearMin,
    yearMax,
    scoreMin,
    scoreMax,
    search,
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
  };

  // derive genres from Prisma enum so the list always matches the schema
  const genres = Object.values(Genre);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Game Dashboard</h1>
        <ActionButtons />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="hidden md:col-span-1 md:block">
          <FiltersClient genres={genres} developers={developers} />
        </div>
        <div className="col-span-1 md:col-span-3">
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
