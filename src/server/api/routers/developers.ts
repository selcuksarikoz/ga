import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const developersRouter = createTRPCRouter({
  // list developers
  list: protectedProcedure.query(async ({ ctx }) => {
    const devs = await ctx.db.developer.findMany({
      select: { id: true, name: true },
    });
    return devs.map((d) => ({ id: d.id, name: d.name }));
  }),
  // list developers done
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const dev = await ctx.db.developer.create({
        data: { name: input.name },
      });
      return dev;
    }),
});

export default developersRouter;
