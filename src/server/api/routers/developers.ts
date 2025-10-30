import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const developersRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const devs = await ctx.db.developer.findMany({
      select: { id: true, name: true },
    });
    return devs.map((d) => ({ id: d.id, name: d.name }));
  }),
});

export default developersRouter;
