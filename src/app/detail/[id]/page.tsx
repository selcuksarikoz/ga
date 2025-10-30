import React from "react";
import { caller } from "@/trpc/server";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { notFound } from "next/navigation";

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await caller.game.get({ id: params.id });

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
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
    </div>
  );
}
