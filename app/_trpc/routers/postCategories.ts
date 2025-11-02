import { z } from "zod";
import { router, publicProcedure } from "../server";

export const postCategoriesRouter = router({
  attach: publicProcedure
    .input(
      z.object({
        post_id: z.number(),
        category_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
     await ctx.pool.query(`
  INSERT INTO post_categories (post_id, category_id)
  VALUES ($1, unnest($2::int[]))
  ON CONFLICT (post_id, category_id) DO NOTHING;
`, [postId, categoryIds]);

      return { success: true };
    }),

  remove: publicProcedure
    .input(
      z.object({
        post_id: z.number(),
        category_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pool.query(
        `DELETE FROM post_categories WHERE post_id = $1 AND category_id = $2;`,
        [input.post_id, input.category_id]
      );
      return { success: true };
    }),
});
