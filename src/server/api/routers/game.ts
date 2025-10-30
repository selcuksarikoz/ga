import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const gameRouter = createTRPCRouter({
  // get a game by id
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: { id: input.id },
        include: { developer: true },
      });
      return game;
    }),
  // get a game by id done
  // list games with filters and pagination
  list: publicProcedure
    .input(
      z.object({
        developerId: z.string().optional(),
        releaseYear: z.number().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        sortBy: z
          .enum(["title", "releaseYear", "price", "score", "createdAt"])
          .optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const schema = z.object({
        developerId: z.string().optional(),
        releaseYear: z.number().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        sortBy: z
          .enum(["title", "releaseYear", "price", "score", "createdAt"])
          .optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      });

      const parsed = schema.parse(input);

      const {
        developerId,
        releaseYear,
        priceMin,
        priceMax,
        page,
        limit,
        sortBy,
        sortOrder,
      } = parsed;

      const where: Prisma.GameWhereInput & { price?: Prisma.FloatFilter } = {};
      if (developerId) where.developerId = developerId;
      if (releaseYear !== undefined) where.releaseYear = releaseYear;
      if (priceMin !== undefined || priceMax !== undefined) {
        const priceFilter: Prisma.FloatFilter = {} as Prisma.FloatFilter;
        if (priceMin !== undefined) priceFilter.gte = priceMin;
        if (priceMax !== undefined) priceFilter.lte = priceMax;
        where.price = priceFilter;
      }

      const total = await ctx.db.game.count({ where });

      let orderBy: Prisma.GameOrderByWithRelationInput = { createdAt: "desc" };
      if (sortBy) {
        const dir = sortOrder === "asc" ? "asc" : "desc";
        if (sortBy === "createdAt") orderBy = { createdAt: dir };
        else orderBy = { [sortBy]: dir } as Prisma.GameOrderByWithRelationInput;
      }

      const games = await ctx.db.game.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { developer: true },
      });

      return {
        games,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    }),
  // list games with filters and pagination done
});

export default gameRouter;
