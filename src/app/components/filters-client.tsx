"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FilterPanel } from "./filter-panel";

export default function FiltersClient({ genres, developers, platforms }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFiltersFromParams = () => {
    return {
      search: searchParams.get("search") ?? "",
      genre: searchParams.get("genre") ?? "",
      developer: searchParams.get("developerId") ?? "",
      yearMin: Number(searchParams.get("yearMin") ?? 2010),
      yearMax: Number(searchParams.get("yearMax") ?? new Date().getFullYear()),
      priceMin: Number(searchParams.get("priceMin") ?? 0),
      priceMax: Number(searchParams.get("priceMax") ?? 100),
      scoreMin: Number(searchParams.get("scoreMin") ?? 0),
      scoreMax: Number(searchParams.get("scoreMax") ?? 100),
      platform: searchParams.get("platform") ?? "",
    };
  };

  const updateFilters = (filters: any) => {
    const url = new URL(window.location.toString());
    if (filters.developer) {
      // filters.developer is the developer id directly now
      url.searchParams.set("developerId", filters.developer);
    } else {
      url.searchParams.delete("developerId");
    }
    if (filters.yearMin)
      url.searchParams.set("releaseYear", String(filters.yearMin));
    else url.searchParams.delete("releaseYear");
    if (filters.priceMin !== undefined)
      url.searchParams.set("priceMin", String(filters.priceMin));
    else url.searchParams.delete("priceMin");
    if (filters.priceMax !== undefined)
      url.searchParams.set("priceMax", String(filters.priceMax));
    else url.searchParams.delete("priceMax");
    // reset to page 1 when filters change
    url.searchParams.set("page", "1");
    router.push(url.pathname + url.search);
  };

  // developers passed in as array of {id,name}
  return (
    <FilterPanel
      filters={getFiltersFromParams()}
      onFiltersChange={updateFilters}
      genres={genres}
      developers={developers}
      platforms={platforms}
    />
  );
}
