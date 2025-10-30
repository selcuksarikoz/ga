"use server";

import { revalidatePath } from "next/cache";
import { caller } from "@/trpc/server";

/**
 * Server Action to create a new developer.
 * @param name The name of the new developer.
 * @returns The newly created developer object or an error.
 */
export async function createDeveloperAction(name: string) {
  try {
    const newDeveloper = await caller.developers.create({ name });
    // Revalidate the dashboard path to refresh the developer list in filters.
    revalidatePath("/dashboard");
    return { data: newDeveloper, error: null };
  } catch (error) {
    return { data: null, error: "Failed to create developer." };
  }
}
