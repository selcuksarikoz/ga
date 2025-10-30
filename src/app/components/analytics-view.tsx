"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenreComparison {
  genre: string;
  yearA: {
    count: number;
    avgPrice: number;
    highestScore: number;
    lowestScore: number;
  };
  yearB: {
    count: number;
    avgPrice: number;
    highestScore: number;
    lowestScore: number;
  };
}

export function AnalyticsView() {
  const [yearA, setYearA] = useState(2020);
  const [yearB, setYearB] = useState(2024);
  const [data, setData] = useState<GenreComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/analytics?yearA=${yearA}&yearB=${yearB}`);
      const result = await res.json();
      setData(result.comparison);
      setLoading(false);
    };
    fetchData();
  }, [yearA, yearB]);

  const years = Array.from({ length: 15 }, (_, i) => 2010 + i);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrend = (valueA: number, valueB: number) => {
    if (valueB > valueA)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (valueB < valueA)
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="text-muted-foreground h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Year Comparison</CardTitle>
          <CardDescription>
            Compare game statistics across different release years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Year A</label>
              <Select
                value={yearA.toString()}
                onValueChange={(v) => setYearA(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Year B</label>
              <Select
                value={yearB.toString()}
                onValueChange={(v) => setYearB(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="bg-muted h-4 w-24 rounded" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-muted h-3 w-full rounded" />
                <div className="bg-muted h-3 w-full rounded" />
                <div className="bg-muted h-3 w-full rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((genre) => (
            <Card
              key={genre.genre}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg">{genre.genre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Games</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{genre.yearA.count}</Badge>
                      {getTrend(genre.yearA.count, genre.yearB.count)}
                      <Badge variant="outline">{genre.yearB.count}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        ${genre.yearA.avgPrice.toFixed(2)}
                      </span>
                      {getTrend(genre.yearA.avgPrice, genre.yearB.avgPrice)}
                      <span className="text-xs">
                        ${genre.yearB.avgPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Highest Score
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-white",
                            getScoreColor(genre.yearA.highestScore),
                          )}
                        >
                          {genre.yearA.highestScore.toFixed(1)}
                        </Badge>
                        <span className="text-muted-foreground">vs</span>
                        <Badge
                          className={cn(
                            "text-white",
                            getScoreColor(genre.yearB.highestScore),
                          )}
                        >
                          {genre.yearB.highestScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Lowest Score
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-white",
                            getScoreColor(genre.yearA.lowestScore),
                          )}
                        >
                          {genre.yearA.lowestScore.toFixed(1)}
                        </Badge>
                        <span className="text-muted-foreground">vs</span>
                        <Badge
                          className={cn(
                            "text-white",
                            getScoreColor(genre.yearB.lowestScore),
                          )}
                        >
                          {genre.yearB.lowestScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-muted-foreground mb-1 text-xs">
                      Score Range
                    </div>
                    <div className="flex h-2 gap-1">
                      <div
                        className={cn(
                          "rounded-l",
                          getScoreColor(genre.yearA.highestScore),
                        )}
                        style={{
                          width: `${(genre.yearA.highestScore - genre.yearA.lowestScore) / 2}%`,
                        }}
                      />
                      <div
                        className={cn(
                          "rounded-r",
                          getScoreColor(genre.yearB.highestScore),
                        )}
                        style={{
                          width: `${(genre.yearB.highestScore - genre.yearB.lowestScore) / 2}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
