"use client";

import { Suspense, useEffect, useState } from "react";
import { StatsCards } from "@/app/components/stats-cards";
import { GamesTable } from "@/app/components/games-table";
import { FilterPanel, type Filters } from "@/app/components/filter-panel";
import { AnalyticsView } from "@/app/components/analytics-view";
import { AddGameDialog } from "@/app/components/add-game-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Share2, Database } from "lucide-react";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();

  const [stats, setStats] = useState({
    totalGames: 0,
    developerCount: 0,
    avgScore: "0",
  });

  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    developers: [],
    platforms: [],
  });

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    developer: searchParams.get("developer") || "",
    yearMin: parseInt(searchParams.get("yearMin") || "2010"),
    yearMax: parseInt(searchParams.get("yearMax") || "2024"),
    priceMin: parseFloat(searchParams.get("priceMin") || "0"),
    priceMax: parseFloat(searchParams.get("priceMax") || "70"),
    scoreMin: parseFloat(searchParams.get("scoreMin") || "0"),
    scoreMax: parseFloat(searchParams.get("scoreMax") || "100"),
    platform: searchParams.get("platform") || "",
  });

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const res = await fetch("/api/filters");
      const data = await res.json();
      setFilterOptions(data);
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, v.toString()]),
        ),
      });

      const res = await fetch(`/api/games?${params}`);
      const data = await res.json();
      setGames(data.games);
      setPagination(data.pagination);
      setLoading(false);
    };

    fetchGames();
  }, [filters, pagination.page, pagination.limit, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const shareURL = () => {
    const params = new URLSearchParams({
      sortBy,
      sortOrder,
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(([_, v]) => v !== "" && v !== 0)
          .map(([k, v]) => [k, v.toString()]),
      ),
    });

    const url = `${window.location.origin}?${params}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleGameAdded = () => {
    // Refresh games and stats
    const fetchStats = async () => {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="text-primary h-8 w-8" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Game Database Manager
              </h1>
              <p className="text-muted-foreground">
                Modern game database with advanced filtering and analytics
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <AddGameDialog
              genres={filterOptions.genres}
              developers={filterOptions.developers}
              platforms={filterOptions.platforms}
              onGameAdded={handleGameAdded}
            />
            <Button variant="outline" onClick={shareURL}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Filters
            </Button>
          </div>
        </div>

        <StatsCards
          totalGames={stats.totalGames}
          developerCount={stats.developerCount}
          avgScore={stats.avgScore}
        />

        <Tabs defaultValue="database" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  genres={filterOptions.genres}
                  developers={filterOptions.developers}
                  platforms={filterOptions.platforms}
                />
              </div>

              <div className="lg:col-span-3">
                <Card className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted h-12 animate-pulse rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <GamesTable
                      games={games}
                      pagination={pagination}
                      onSort={handleSort}
                      onPageChange={handlePageChange}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <span className="text-muted-foreground">Loading dashboard…</span>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
