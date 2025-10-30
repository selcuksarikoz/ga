import React from "react";
import { caller } from "@/trpc/server";

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await caller.game.get({ id: params.id });

  if (!game) return <div className="p-6">Game not found</div>;

  return (
    <main className="p-6">
      <div className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">{game.title}</h1>
        <p className="text-muted-foreground mb-4 text-sm">
          By {game.developer?.name ?? "Unknown"} • {game.releaseYear}
        </p>
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2">{game.description}</p>
          <p className="text-muted-foreground text-sm">
            Platforms: {game.platforms}
          </p>
          <p className="text-muted-foreground text-sm">
            Price: $
            {typeof game.price === "number"
              ? game.price.toFixed(2)
              : game.price}
          </p>
          <p className="text-muted-foreground text-sm">Score: {game.score}</p>
        </div>
      </div>
    </main>
  );
}
