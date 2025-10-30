"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "@/lib/debounce";

const FilterPanel = dynamic(
  () => import("./filter-panel").then((m) => m.FilterPanel),
  {
    ssr: false,
  },
);

export default function FiltersClient({ genres, developers, platforms }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFiltersFromParams = useCallback(() => {
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
  }, [searchParams]);

  const [localFilters, setLocalFilters] = useState(getFiltersFromParams);

  useEffect(() => {
    // keep local state in sync if the URL changes externally
    setLocalFilters(getFiltersFromParams());
  }, [getFiltersFromParams]);

  const pushFiltersToUrl = useCallback(
    (filters: any) => {
      const url = new URL(window.location.toString());
      if (filters.developer) {
        url.searchParams.set("developerId", filters.developer);
      } else {
        url.searchParams.delete("developerId");
      }
      if (filters.genre) url.searchParams.set("genre", String(filters.genre));
      else url.searchParams.delete("genre");
      if (filters.search)
        url.searchParams.set("search", String(filters.search));
      else url.searchParams.delete("search");

      url.searchParams.set("yearMin", String(filters.yearMin));
      url.searchParams.set("yearMax", String(filters.yearMax));
      url.searchParams.set("priceMin", String(filters.priceMin));
      url.searchParams.set("priceMax", String(filters.priceMax));
      url.searchParams.set("scoreMin", String(filters.scoreMin));
      url.searchParams.set("scoreMax", String(filters.scoreMax));

      if (filters.platform)
        url.searchParams.set("platform", String(filters.platform));
      else url.searchParams.delete("platform");

      // reset to page 1 when filters change
      url.searchParams.set("page", "1");
      router.push(url.pathname + url.search);
    },
    [router],
  );

  // debounce pushes to avoid rapid router pushes when typing
  const debouncedPush = useMemo(
    () => debounce(pushFiltersToUrl, 500),
    [pushFiltersToUrl],
  );

  const onFiltersChange = (filters: any) => {
    setLocalFilters(filters);
    // apply debounce for normal filter changes
    debouncedPush(filters);
  };

  const onClear = (filters: any) => {
    // immediate clear
    setLocalFilters(filters);
    pushFiltersToUrl(filters);
  };

  return (
    // the dynamic FilterPanel will receive localFilters as a controlled value
    <FilterPanel
      filters={localFilters}
      onFiltersChange={onFiltersChange}
      genres={genres}
      developers={developers}
      platforms={platforms}
    />
  );
}
