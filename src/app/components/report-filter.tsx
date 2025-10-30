"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import clsx from "clsx";

interface ReportFilterProps {
  initialYearA?: number;
  initialYearB?: number;
  onSubmit: (yearA: number, yearB: number) => void;
  buttonLabel: string;
  className?: string;
}

const reportSchema = z
  .object({
    yearA: z.number({ required_error: "Please select a start year." }),
    yearB: z.number({ required_error: "Please select an end year." }),
  })
  .refine((data) => data.yearA <= data.yearB, {
    message: "Start year cannot be greater than end year.",
    path: ["yearA"],
  });

export function ReportFilter({
  initialYearA,
  initialYearB,
  onSubmit,
  buttonLabel,
  className,
}: ReportFilterProps) {
  const [yearA, setYearA] = useState<number | undefined>(initialYearA);
  const [yearB, setYearB] = useState<number | undefined>(initialYearB);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setYearA(initialYearA);
    setYearB(initialYearB);
  }, [initialYearA, initialYearB]);

  const handleSubmit = () => {
    const result = reportSchema.safeParse({ yearA, yearB });
    if (result.success) {
      setError(null);
      onSubmit(result.data.yearA, result.data.yearB);
    } else {
      setError(result.error.errors[0]?.message ?? "Invalid input.");
    }
  };

  const years = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 flex-col gap-2">
        <Label>Start Year</Label>
        <Select
          onValueChange={(value) => {
            setYearA(Number(value));
            if (yearB && Number(value) > yearB) {
              setError("Start year cannot be greater than end year.");
            } else {
              setError(null);
            }
          }}
          value={yearA?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select start year" />
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

      <div className="flex flex-1 flex-col gap-2">
        <Label>End Year</Label>
        <Select
          onValueChange={(value) => {
            setYearB(Number(value));
            if (yearA && Number(value) < yearA) {
              setError("End year cannot be less than start year.");
            } else {
              setError(null);
            }
          }}
          value={yearB?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select end year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                disabled={yearA !== undefined && year < yearA}
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleSubmit}
        disabled={!yearA || !yearB}
        className="mt-2 ml-auto w-fit"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
