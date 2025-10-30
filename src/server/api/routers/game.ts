import { z } from "zod";
import { type Prisma, Genre } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const gameRouter = createTRPCRouter({
  // get a game by id
  get: protectedProcedure
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
  list: protectedProcedure
    .input(
      z.object({
        genre: z.string().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        scoreMin: z.number().optional(),
        scoreMax: z.number().optional(),
        search: z.string().optional(),
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
        genre: z.string().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        scoreMin: z.number().optional(),
        scoreMax: z.number().optional(),
        search: z.string().optional(),
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
        genre,
        yearMin,
        yearMax,
        scoreMin,
        scoreMax,
        search,
        developerId,
        releaseYear,
        priceMin,
        priceMax,
        page,
        limit,
        sortBy,
        sortOrder,
      } = parsed;
      const where: Prisma.GameWhereInput & {
        price?: Prisma.FloatFilter;
        score?: Prisma.FloatFilter;
        releaseYear?: Prisma.IntFilter;
        title?: Prisma.StringFilter;
      } = {};

      if (developerId) where.developerId = developerId;

      // exact releaseYear takes precedence over range
      if (releaseYear !== undefined) where.releaseYear = releaseYear;
      else if (yearMin !== undefined || yearMax !== undefined) {
        const yearFilter: Prisma.IntFilter = {} as Prisma.IntFilter;
        if (yearMin !== undefined) yearFilter.gte = yearMin;
        if (yearMax !== undefined) yearFilter.lte = yearMax;
        where.releaseYear = yearFilter;
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        const priceFilter: Prisma.FloatFilter = {} as Prisma.FloatFilter;
        if (priceMin !== undefined) priceFilter.gte = priceMin;
        if (priceMax !== undefined) priceFilter.lte = priceMax;
        where.price = priceFilter;
      }

      if (scoreMin !== undefined || scoreMax !== undefined) {
        const scoreFilter: Prisma.FloatFilter = {} as Prisma.FloatFilter;
        if (scoreMin !== undefined) scoreFilter.gte = scoreMin;
        if (scoreMax !== undefined) scoreFilter.lte = scoreMax;
        where.score = scoreFilter;
      }

      if (genre) {
        // Prisma expects the enum value; passing the string works at runtime
        // but we cast the type for TypeScript compatibility
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where.genre = genre as any;
      }

      if (search) {
        // case-insensitive contains on title
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where.title = { contains: search, mode: "insensitive" } as any;
      }

      const total = await ctx.db.game.count({ where });

      const sortDir = sortOrder ?? "desc";
      const sortColumn = sortBy ?? "createdAt";
      const orderBy: Prisma.GameOrderByWithRelationInput = {
        [sortColumn]: sortDir,
      };

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

  //report
  report: protectedProcedure
    .input(
      z.object({
        yearA: z.number(),
        yearB: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { yearA, yearB } = input;
      const minYear = Math.min(yearA, yearB);
      const maxYear = Math.max(yearA, yearB);

      const result = await ctx.db.game.groupBy({
        by: ["genre"],
        where: {
          releaseYear: {
            gte: minYear,
            lte: maxYear,
          },
        },
        _count: {
          id: true,
        },
        _avg: {
          price: true,
        },
        _max: {
          score: true,
        },
        _min: {
          score: true,
        },
      });

      const report = result.map((r) => ({
        genre: r.genre,
        gameCount: r._count.id,
        averagePrice: r._avg.price,
        highestScore: r._max.score,
        lowestScore: r._min.score,
      }));

      return report;
    }),
  //report done

  // create a game
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        genre: z.nativeEnum(Genre),
        releaseYear: z.date(),
        developerId: z.string(),
        price: z.number(),
        score: z.number(),
        platforms: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.game.create({
        data: {
          ...input,
          releaseYear: input.releaseYear.getFullYear(),
        },
      });
      return game;
    }),
  // create a game done

  // delete a game
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.game.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
  // delete a game done
});

export default gameRouter;
