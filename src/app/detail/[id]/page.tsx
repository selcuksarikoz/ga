import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { caller } from "@/trpc/server";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { notFound } from "next/navigation";

export default async function GameDetailPage(props: { params: any }) {
  const params = await props.params;
  const game = await caller.game.get({ id: params.id });

  if (!game) {
    notFound();
  }

  return (
    <Card className="container mx-auto mt-2">
      <CardHeader className="flex flex-row items-center gap-2">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-primary mr-2 flex items-center transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <CardTitle>{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <strong>Developer:</strong> {game.developer.name}
        </div>
        <div>
          <strong>Genre:</strong> <Badge>{game.genre}</Badge>
        </div>
        <div>
          <strong>Release Year:</strong> {game.releaseYear}
        </div>
        <div>
          <strong>Price:</strong> ${game.price.toFixed(2)}
        </div>
        <div>
          <strong>Score:</strong> {game.score}
        </div>
        <div>
          <strong>Platforms:</strong>
          <div className="flex flex-wrap gap-2">
            {game.platforms.split(",").map((platform) => (
              <Badge key={platform} variant="secondary">
                {platform.trim()}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <strong>Description:</strong>
          <p>{game.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
