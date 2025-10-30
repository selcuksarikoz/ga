"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import Loading from "@/app/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Trash2 } from "lucide-react";
import Link from "next/link";
import { PaginationClient } from "./pagination-client";

interface Game {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  price: number;
  score: number;
  platforms: string;
  developer: {
    name: string;
  };
}

interface GamesTableProps {
  games: Game[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  onDeleteGame: (id: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  isLoading?: boolean;
}

interface SortButtonProps {
  column: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

function SortButton({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
}: SortButtonProps) {
  const isActive = sortBy === column;
  const sortLabel = isActive
    ? ` (${sortOrder === "asc" ? "ascending" : "descending"})`
    : "";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="data-[state=open]:bg-accent -ml-3 h-8"
      onClick={() => onSort(column)}
      aria-label={`Sort by ${label}${sortLabel}`}
    >
      {label}
      <ArrowUpDown className={cn("ml-2 h-4 w-4", isActive && "text-primary")} />
    </Button>
  );
}

export function GamesTable({
  games,
  pagination,
  onSort,
  onPageChange,
  onDeleteGame,
  sortBy,
  sortOrder,
  isLoading = false,
}: GamesTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="relative flex flex-col gap-2 rounded-md">
      {/* Overlay covers both the table and pagination and is centered */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <div className="h-[calc(100vh-140px)] overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton
                  column="title"
                  label="Game Title"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  column="developer"
                  label="Developer"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  column="genre"
                  label="Genre"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  column="releaseYear"
                  label="Year"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  column="price"
                  label="Price"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  column="score"
                  label="Score"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>Platforms</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No games found.
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/detail/${game.id}`}
                      className="hover:underline"
                    >
                      {game.title}
                    </Link>
                  </TableCell>
                  <TableCell>{game.developer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{game.genre}</Badge>
                  </TableCell>
                  <TableCell>{game.releaseYear}</TableCell>
                  <TableCell>${game.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={cn("font-semibold", getScoreColor(game.score))}
                    >
                      {game.score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platforms.split(",").map((platform, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {platform.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Trash2
                      className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => onDeleteGame(game.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationClient pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
