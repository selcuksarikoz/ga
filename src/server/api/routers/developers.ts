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
});

export default developersRouter;
