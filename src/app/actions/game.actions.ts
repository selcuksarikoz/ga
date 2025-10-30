"use server";

import { revalidatePath } from "next/cache";
import { caller } from "@/trpc/server";
import { Genre } from "@prisma/client";

/**
 * Server Action to create a new game.
 * @param formData The game data.
 */
export async function createGameAction(formData: {
  title: string;
  genre: Genre;
  releaseYear: number;
  developerId: string;
  price: number;
  score: number;
  platforms: string;
  description: string;
}) {
  try {
    await caller.game.create({
      ...formData,
      releaseDate: new Date(formData.releaseYear, 0, 1),
    });
    // Revalidate the dashboard path to refresh the game list.
    revalidatePath("/dashboard");
  } catch (error) {
    return { error: "Failed to create game." };
  }
}
