"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/components/ui/dialog";

export interface Filters {
  search: string;
  genre: string;
  developer: string; // developer id
  yearMin: number;
  yearMax: number;
  priceMin: number;
  priceMax: number;
  scoreMin: number;
  scoreMax: number;
  platform: string;
}

interface DeveloperOption {
  id: string;
  name: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  genres: string[];
  developers: DeveloperOption[];
  platforms: string[];
}

export function FilterPanel({
  filters,
  onFiltersChange,
  genres,
  developers,
  platforms,
}: FilterPanelProps) {
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
      platform: "",
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.genre,
    filters.developer,
    filters.platform,
  ].filter(Boolean).length;

  const FilterContent = (
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
        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label>Platform</Label>
          <Select
            value={filters.platform || ALL_OPTION}
            onValueChange={(v: string) =>
              updateFilter("platform", v === ALL_OPTION ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OPTION}>All platforms</SelectItem>
              {platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>
            Release Year: {filters.yearMin} - {filters.yearMax}
          </Label>
          <Slider
            min={2010}
            max={2024}
            step={1}
            value={[filters.yearMin, filters.yearMax]}
            onValueChange={([min, max]: [number, number]) => {
              updateFilter("yearMin", min);
              updateFilter("yearMax", max);
            }}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Price: ${filters.priceMin} - ${filters.priceMax}
          </Label>
          <Slider
            min={0}
            max={70}
            step={5}
            value={[filters.priceMin, filters.priceMax]}
            onValueChange={([min, max]: [number, number]) => {
              updateFilter("priceMin", min);
              updateFilter("priceMax", max);
            }}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Score: {filters.scoreMin} - {filters.scoreMax}
          </Label>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[filters.scoreMin, filters.scoreMax]}
            onValueChange={([min, max]: [number, number]) => {
              updateFilter("scoreMin", min);
              updateFilter("scoreMax", max);
            }}
            className="mt-2"
          />
        </div>
      </CardContent>
    </>
  );

  return (
    <>
      {/* Desktop / tablet: sticky card */}
      <div className="hidden md:block">
        <Card className="sticky top-4">{FilterContent}</Card>
      </div>

      {/* Mobile: floating filter button that opens a dialog */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed right-6 bottom-6 z-50 rounded-full p-3 shadow-lg">
              <Filter className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg p-4">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" className="ml-auto">
                  Close
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="mt-2">
              <Card>{FilterContent}</Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
