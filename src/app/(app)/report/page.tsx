import { Suspense } from "react";
import ReportClient from "./report-client";

export default function ReportPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Game Reports</h1>
      <Suspense>
        <ReportClient />
      </Suspense>
    </>
  );
}
