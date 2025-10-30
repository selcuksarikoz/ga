"use client";

import { Card } from "@/app/components/ui/card";
import type { Filters } from "./filter-content";
import FilterContent from "./filter-content";

interface DeveloperOption {
  id: string;
  name: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  genres: string[];
  developers: DeveloperOption[];
}

export function FilterPanel({
  filters,
  onFiltersChange,
  genres,
  developers,
}: FilterPanelProps) {
  return (
    <Card className="sticky top-4">
      <FilterContent
        filters={filters}
        onFiltersChange={onFiltersChange}
        genres={genres}
        developers={developers}
      />
    </Card>
  );
}

export default FilterPanel;
