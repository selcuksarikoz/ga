"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Loading from "@/app/components/ui/loading";
import { ReportFilter } from "@/app/components/report-filter";

export default function ReportClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const yearA = searchParams.get("yearA")
    ? Number(searchParams.get("yearA"))
    : undefined;
  const yearB = searchParams.get("yearB")
    ? Number(searchParams.get("yearB"))
    : undefined;

  const { data, isLoading, error } = api.game.report.useQuery(
    {
      yearA: yearA ?? new Date().getFullYear() - 1,
      yearB: yearB ?? new Date().getFullYear(),
    },
    {
      enabled: yearA !== undefined && yearB !== undefined,
    },
  );

  const handleGenerateReport = (newYearA: number, newYearB: number) => {
    // safe to use `location` here because this is a client component
    const url = new URL(location.href);
    url.searchParams.set("yearA", String(newYearA));
    url.searchParams.set("yearB", String(newYearB));
    router.push(url.pathname + url.search);
  };

  return (
    <div>
      <div className="mb-4">
        <ReportFilter
          initialYearA={yearA}
          initialYearB={yearB}
          onSubmit={handleGenerateReport}
          buttonLabel="Generate Report"
        />
      </div>

      {isLoading && <Loading />}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((report) => (
            <Card key={report.genre}>
              <CardHeader>
                <CardTitle>{report.genre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Games: {report.gameCount}</p>
                <p>
                  Average Price: ${report.averagePrice?.toFixed(2) ?? "N/A"}
                </p>
                <p>Highest Score: {report.highestScore ?? "N/A"}</p>
                <p>Lowest Score: {report.lowestScore ?? "N/A"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
