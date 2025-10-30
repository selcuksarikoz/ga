"use client";

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/components/ui/dialog";
import FilterContent from "./filter-content";
import type { Filters } from "./filter-content";

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
    <div className="md:sticky md:top-4">
      <div className="hidden md:block">
        <Card className="sticky top-4">
          <FilterContent
            filters={filters}
            onFiltersChange={onFiltersChange}
            genres={genres}
            developers={developers}
          />
        </Card>
      </div>

      {/* Mobile: floating filter button that opens a dialog */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed right-6 bottom-6 z-50 rounded-full p-3 shadow-lg">
              <FilterIcon className="h-5 w-5" />
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
              <Card>
                <FilterContent
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  genres={genres}
                  developers={developers}
                />
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default FilterPanel;
