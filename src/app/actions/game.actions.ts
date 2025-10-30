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
      releaseYear: new Date(formData.releaseYear, 0, 1),
    });
    // Revalidate the dashboard path to refresh the game list.
    // Since it's a single page, I put revalidatePath here. I could have done it on the page where I called the action with the async/promise structure.
    revalidatePath("/dashboard");
    return { message: "Game created successfully." };
  } catch (error) {
    return { error: "Failed to create game." };
  }
}

/**
 * Server Action to delete a game.
 * @param id The ID of the game to delete.
 */
export async function deleteGameAction(id: string) {
  try {
    await caller.game.delete({ id });
    revalidatePath("/dashboard");
    return { message: "Game deleted successfully." };
  } catch (error) {
    return { message: "Failed to delete game." };
  }
}
