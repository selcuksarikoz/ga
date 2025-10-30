"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import { CardHeader, CardContent, CardTitle } from "@/app/components/ui/card";
import { ReportFilter } from "@/app/components/report-filter";

export interface Filters {
  search: string;
  genre: string;
  developer: string;
  yearMin: number;
  yearMax: number;
  priceMin: number;
  priceMax: number;
  scoreMin: number;
  scoreMax: number;
}

interface DeveloperOption {
  id: string;
  name: string;
}

interface FilterContentProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  genres: string[];
  developers: DeveloperOption[];
}

export default function FilterContent({
  filters,
  onFiltersChange,
  genres,
  developers,
}: FilterContentProps) {
  const router = useRouter();
  const ALL_OPTION = "all";

  const updateFilter = (key: keyof Filters, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      genre: "",
      developer: "",
      yearMin: 2010,
      yearMax: 2024,
      priceMin: 0,
      priceMax: 70,
      scoreMin: 0,
      scoreMax: 100,
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.genre,
    filters.developer,
  ].filter(Boolean).length;

  const handleGoToReport = (yearA: number, yearB: number) => {
    router.push(`/report?yearA=${yearA}&yearB=${yearB}`);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search games..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label>Genre</Label>
          <Select
            value={filters.genre || ALL_OPTION}
            onValueChange={(v: string) =>
              updateFilter("genre", v === ALL_OPTION ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OPTION}>All genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Developer</Label>
          <Select
            value={filters.developer || ALL_OPTION}
            onValueChange={(v: string) =>
              updateFilter("developer", v === ALL_OPTION ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All developers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OPTION}>All developers</SelectItem>
              {developers.map((dev) => (
                <SelectItem key={dev.id} value={dev.id}>
                  {dev.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <ReportFilter onSubmit={handleGoToReport} buttonLabel="Get Report" />
      </CardContent>
    </>
  );
}
